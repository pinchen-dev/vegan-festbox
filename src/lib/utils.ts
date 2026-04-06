import { clsx, type ClassValue } from "clsx"
import { Metadata } from "next"
import { twMerge } from "tailwind-merge"
import { COLORS, FINISHES, MODELS, DECORATIONS, BOX_SETS } from "@/validators/option-validators";

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
  title = "Vegan Festbox - 訂製專屬您的純素禮盒",
  description = "高品質且友善地球的純素禮盒",
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

export interface ConfigSpec {
  label: string;
  value: string;
}

export const getConfigurationSpecs = (config: any): ConfigSpec[] => {
  if (!config) return [];

  const decoMapping: Record<string, (val: string) => { label: string; value: string }> = {
    wax_seal: () => {
      const selectedModel = MODELS.options.find(m => m.value === config.occasion);
      return {
        label: "專屬蠟封",
        value: (selectedModel ? `${selectedModel.label} 款式` : "經典款式")
      };
    },
    twine: () => ({
      label: "裝飾物",
      value: "天然環保亞麻繩"
    }),
    botanical: (val) => {
      const option = DECORATIONS.options.find(d => d.value === 'botanical');
      const parts = val.split('-');
      const variantId = parts.length > 1 ? parseInt(parts[1]) : null;
      const variant = variantId !== null ? (option as any)?.variants?.find((v: any) => v.id === variantId) : null;
      
      return {
        label: "裝飾物",
        value: variant ? `${option?.label} (${variant.name})` : (option?.label || "乾燥花材")
      };
    }
  };

  const specs: ConfigSpec[] = [
    {
      label: "商品款式",
      value: BOX_SETS.options.find(b => b.value === config.boxSet)?.label || "經典點心組"
    },
    { 
      label: "禮盒色系", 
      value: COLORS.find(c => c.value === config.color)?.label || "經典原色" 
    },
    { 
      label: "表面工藝", 
      value: FINISHES.options.find(f => f.value === config.finish)?.label || "標準簡約" 
    }
  ];

  const decorationOrder = ['wax_seal', 'twine', 'botanical'];

  if (config.decoration && Array.isArray(config.decoration)) {
    decorationOrder.forEach((key) => {
      const userChoice = config.decoration.find((d: any) => typeof d === 'string' && d.startsWith(key));
      const strategy = decoMapping[key];

      if (userChoice && strategy) {
        try {
          specs.push(strategy(userChoice));
        } catch (e) {
          console.error(e);
        }
      }
    });
  }

  return specs;
};