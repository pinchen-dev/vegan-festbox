"use server"

import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products"
import { db } from "@/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import crypto from "crypto"

export const createCheckoutSession = async ({ configId }: { configId: string }) => {
    const configuration = await db.configuration.findUnique({
        where: { id: configId },
    })

    if (!configuration) {
        throw new Error("找不到該配置資訊")
    }

    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user || !user.id) {
        throw new Error("您需要先登入")
    }

    const { boxSet, finish, decoration } = configuration

    let price = BASE_PRICE

    if (boxSet && boxSet in PRODUCT_PRICES.boxSet) {
        price += PRODUCT_PRICES.boxSet[boxSet as keyof typeof PRODUCT_PRICES.boxSet]
    }
    if (finish && finish in PRODUCT_PRICES.finish) {
        price += PRODUCT_PRICES.finish[finish as keyof typeof PRODUCT_PRICES.finish]
    }
    if (decoration && decoration in PRODUCT_PRICES.decoration) {
        price += PRODUCT_PRICES.decoration[decoration as keyof typeof PRODUCT_PRICES.decoration]
    }

    let order = await db.order.findFirst({
        where: {
            userId: user.id,
            configurationId: configuration.id,
        },
    })

    if (!order) {
        order = await db.order.create({
            data: {
                amount: price,
                userId: user.id,
                configurationId: configuration.id,
            },
        })
    }

    const MerchantID = process.env.ECPAY_MERCHANT_ID!
    const HashKey = process.env.ECPAY_HASH_KEY!
    const HashIV = process.env.ECPAY_HASH_IV!

    const MerchantTradeDate = new Date().toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).replace(/-/g, '/')

    const baseParams = {
        MerchantID,
        MerchantTradeNo: `VFB${order.id.slice(-10)}${Date.now().toString().slice(-5)}`,
        MerchantTradeDate,
        PaymentType: 'aio',
        TotalAmount: Math.round(price).toString(),
        TradeDesc: 'Vegan Festbox 純素客製禮盒',
        ItemName: '純素客製禮盒套組',
        ReturnURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/webhooks/ecpay`,
        OrderResultURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
        ChoosePayment: 'ALL',
        EncryptType: '1',
    }

    const sortedParams = Object.keys(baseParams)
        .sort()
        .map((key) => `${key}=${baseParams[key as keyof typeof baseParams]}`)
        .join('&')

    const checkValue = `HashKey=${HashKey}&${sortedParams}&HashIV=${HashIV}`

    const CheckMacValue = crypto
        .createHash('sha256')
        .update(
            encodeURIComponent(checkValue)
                .toLowerCase()
                .replace(/%20/g, '+')
                .replace(/%2d/g, '-')
                .replace(/%5f/g, '_')
                .replace(/%2e/g, '.')
                .replace(/%21/g, '!')
                .replace(/%2a/g, '*')
                .replace(/%28/g, '(')
                .replace(/%29/g, ')')
        )
        .digest('hex')
        .toUpperCase()

    return {
        url: 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5',
        params: { ...baseParams, CheckMacValue },
    }
}