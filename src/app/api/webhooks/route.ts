import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { db } from "@/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature");

    if (!signature) {
      return new Response("Invalid signature", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session & {
        shipping_details?: {
          address?: Stripe.Address;
        };
      };

      const { userId, orderId } = session.metadata || {
        userId: null,
        orderId: null,
      };

      if (!userId || !orderId) {
        throw new Error("Invalid request metadata");
      }

      const customerName = session.customer_details?.name
      const billingAddress = session.customer_details?.address;
      const shippingAddress = session.shipping_details?.address;

if (!customerName || !shippingAddress?.line1 || !shippingAddress?.city) {
  return new Response("缺少必要的收件資訊", { status: 400 });
}

      await db.order.update({
        where: {
          id: orderId,
        },
        data: {
          isPaid: true,
          shippingAddress: {
            create: {
              name:  customerName,
              city: shippingAddress?.city ?? "",
              country: shippingAddress?.country ?? "",
              postalCode: shippingAddress?.postal_code ?? "",
              street1: shippingAddress?.line1 ?? "",
              street2: shippingAddress?.line2 ?? "",
              state: shippingAddress?.state ?? "",
            },
          },
          billingAddress: {
            create: {
              name: customerName,
              city: billingAddress?.city ?? "",
              country: billingAddress?.country ?? "",
              postalCode: billingAddress?.postal_code ?? "",
              street1: billingAddress?.line1 ?? "",
              street2: billingAddress?.line2 ?? "",
              state: billingAddress?.state ?? "",
            },
          },
        },
      });
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Something went wrong", ok: false },
      { status: 500 },
    );
  }
}
