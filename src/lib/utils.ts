import { clsx, type ClassValue } from "clsx"
import { Metadata } from "next"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price: number) => {
  const formatter = new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    minimumFractionDigits: 0,
  })

  return formatter.format(price)
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  awaiting_shipment: "待出貨",
  shipped: "已出貨",
  fulfilled: "已完成",
}

export function constructMetadata({
  title = "Vegan Festbox - 專屬您的純素客製禮盒",
  description = "只需幾秒鐘，即可打造高品質且友善地球的純素禮盒",
  image = "/thumbnail.png",
  icons = "/favicon.ico",
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@pinchen",
    },
    icons,
    metadataBase: new URL("https://vegan-festbox.vercel.app"),
  }
}