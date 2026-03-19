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
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const { userId, orderId } = session.metadata || {
        userId: null,
        orderId: null,
      };

      if (!userId || !orderId) {
        throw new Error("Invalid request metadata");
      }

      const order = await db.order.findUnique({
        where: { id: orderId },
        include: {
          shippingAddress: true,
          billingAddress: true,
        },
      });

      if (!order) {
        throw new Error("Order not found");
      }

      if (order.isPaid) {
        return NextResponse.json({ ok: true });
      }

      const customerName = session.customer_details?.name ?? "";
      const billingAddress = session.customer_details?.address;
      const shippingAddress =
        session.collected_information?.shipping_details?.address;

      if (!customerName || !shippingAddress?.line1 || !shippingAddress?.city) {
        return NextResponse.json({ ok: true });
      }

      await db.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,

          shippingAddress: {
            upsert: {
              create: {
                name: customerName,
                city: shippingAddress.city ?? "",
                country: shippingAddress.country ?? "",
                postalCode: shippingAddress.postal_code ?? "",
                street1: shippingAddress.line1 ?? "",
                street2: shippingAddress.line2 ?? "",
                state: shippingAddress.state ?? "",
              },
              update: {
                name: customerName,
                city: shippingAddress.city ?? "",
                country: shippingAddress.country ?? "",
                postalCode: shippingAddress.postal_code ?? "",
                street1: shippingAddress.line1 ?? "",
                street2: shippingAddress.line2 ?? "",
                state: shippingAddress.state ?? "",
              },
            },
          },

          billingAddress: {
            upsert: {
              create: {
                name: customerName,
                city: billingAddress?.city ?? "",
                country: billingAddress?.country ?? "",
                postalCode: billingAddress?.postal_code ?? "",
                street1: billingAddress?.line1 ?? "",
                street2: billingAddress?.line2 ?? "",
                state: billingAddress?.state ?? "",
              },
              update: {
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
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { message: "Something went wrong", ok: false },
      { status: 500 }
    );
  }
}