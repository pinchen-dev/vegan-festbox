"use server"

import { Resend } from "resend";
import OrderReceivedEmail from "@/components/emails/OrderRecievedEmail";
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export const createCheckoutSession = async ({ 
    configId, 
    hasCard,
    shippingInfo,
    invoiceInfo 
}: { 
    configId: string,
    hasCard: boolean,
    shippingInfo: { 
        name: string; 
        phoneNumber: string; 
        postalCode: string;
        city: string; 
        district: string; 
        address: string
    },
    invoiceInfo: {
        type: "ELECTRONIC" | "COMPANY";
        value?: string;
        companyTitle?: string;
    }
}) => {
    const configuration = await db.configuration.update({
        where: { id: configId },
        data: { hasCard: hasCard},
    });

    if (!configuration) {
        throw new Error("找不到配置資訊");
    }

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id || !user.email) {
        throw new Error("您需要先登入");
    }

    let dbUser = await db.user.findUnique({
        where: { id: user.id }
    });

    if (!dbUser) {
        dbUser = await db.user.create({
            data: {
                id: user.id,
                email: user.email,
            }
        });
    }

    const { boxSet, finish, decoration } = configuration;
    let price = BASE_PRICE;

    if (boxSet && boxSet in PRODUCT_PRICES.boxSet) {
        price += PRODUCT_PRICES.boxSet[boxSet as keyof typeof PRODUCT_PRICES.boxSet];
    }
    if (finish && finish in PRODUCT_PRICES.finish) {
        price += PRODUCT_PRICES.finish[finish as keyof typeof PRODUCT_PRICES.finish];
    }
    
    if (Array.isArray(decoration)) {
        decoration.forEach((d) => {
            const priceKey = d.startsWith("botanical-") ? "botanical" : d;
            if (priceKey in PRODUCT_PRICES.decoration) {
                price += PRODUCT_PRICES.decoration[priceKey as keyof typeof PRODUCT_PRICES.decoration];
            }
        });
    }

    const finalAmount = Math.round(price);

    const address = await db.shippingAddress.create({
        data: {
            name: shippingInfo.name,
            phoneNumber: shippingInfo.phoneNumber,
            city: shippingInfo.city,
            district: shippingInfo.district,
            postalCode: shippingInfo.postalCode,
            address: shippingInfo.address,
        },
    });

    const order = await db.order.create({
        data: {
            amount: finalAmount,
            userId: user.id,
            configurationId: configuration.id,
            isPaid: true,
            status: "awaiting_shipment",
            invoiceType: invoiceInfo.type,
            invoiceValue: invoiceInfo.value || null,
            companyTitle: invoiceInfo.companyTitle || null,
            shippingAddressId: address.id,
        },
        include: {
            shippingAddress: true,
        }
    });

    if (order.shippingAddress) {
        await resend.emails.send({
            from: "Vegan Festbox <onboarding@resend.dev>",
            to: user.email,
            subject: "Welcome to Vegan Festbox! 您的訂單已確認 🌿",
            react: OrderReceivedEmail({
                shippingAddress: order.shippingAddress,
                orderId: order.id,
                orderDate: new Date(order.createdAt).toLocaleDateString(),
                totalAmount: order.amount,
            }),
        });
    }

    return {
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`
    };
}