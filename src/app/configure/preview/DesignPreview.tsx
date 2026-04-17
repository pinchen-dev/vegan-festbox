"use client";

import LoginModal from "@/components/LoginModal";
import { BackButton } from "@/components/ui/back-botton";
import { BoxPreview } from "@/components/ui/BoxPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TAIWAN_DATA } from "@/constants/taiwan-data";
import {
  BOX_SETS,
  COLORS,
  DECORATIONS,
  FINISHES,
  MODELS,
} from "@/validators/option-validators";
import { ShippingInfoSchema } from "@/validators/order-validators";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Configuration } from "@prisma/client";
import {
  AlertCircle,
  Box,
  Heart,
  Image as ImageIcon,
  Loader2,
  Mail,
  Paintbrush,
  Palette,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createCheckoutSession } from "./action";

const DesignPreview = ({ configuration }: { configuration: Configuration }) => {
  const router = useRouter();
  const { user } = useKindeBrowserClient();
  const { id: orderId, imageUrl } = configuration;
  const [showCustomCard, setShowCustomCard] = useState(!!imageUrl);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phoneNumber: "",
    postalCode: "",
    city: "",
    district: "",
    address: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("shipping-info");
    if (saved) {
      setShippingInfo(JSON.parse(saved));
    }


    const savedInvoice = localStorage.getItem("invoice-info");
    if (savedInvoice) {
      setInvoiceInfo(JSON.parse(savedInvoice));
    }
  }, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev: any) => {
      const newInfo = { ...prev, [name]: value };
      localStorage.setItem("shipping-info", JSON.stringify(newInfo));
      return newInfo;
    });
  };

  const InfoItem = ({
    icon: Icon,
    title,
    description,
  }: {
    icon: any;
    title: string;
    description: string;
  }) => (
    <div className="flex gap-4 p-4 rounded-xl transition-colors border border-transparent ">
      <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-m font-bold text-primary">{title}</p>
        <p className="text-sm text-foreground mt-1 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );

  type InvoiceType = "ELECTRONIC" | "COMPANY" | "PAPER";

  const [invoiceInfo, setInvoiceInfo] = useState<{
    type: InvoiceType;
    value: string;
    companyTitle: string;
  }>({
    type: "ELECTRONIC",
    value: "",
    companyTitle: "",
  });

  const handleInvoiceChange = (updates: Partial<typeof invoiceInfo>) => {
    setInvoiceInfo((prev) => {
      const newInfo = { ...prev, ...updates };

      if (updates.type) {
        if (updates.type === "PAPER") {
          newInfo.value = "";
          newInfo.companyTitle = "";
        } else if (updates.type === "ELECTRONIC") {
          newInfo.companyTitle = "";
        }
      }

      localStorage.setItem("invoice-info", JSON.stringify(newInfo));
      return newInfo;
    });
  };

  let totalPrice = 0;

  const currentBoxSet = BOX_SETS.options.find(
    (opt) => opt.value === configuration.boxSet,
  );
  if (currentBoxSet) {
    totalPrice += currentBoxSet.price;
  }

  const currentFinish = FINISHES.options.find(
    (opt) => opt.value === configuration.finish,
  );
  if (currentFinish) {
    totalPrice += currentFinish.price;
  }

  const decorationArray = configuration.decoration || [];
  const botanicalEntry = decorationArray.find((d) =>
    d.startsWith("botanical-"),
  );
  const flowerId = botanicalEntry ? Number(botanicalEntry.split("-")[1]) : null;

  const modelValue = configuration.occasion;
  const waxSealOption = DECORATIONS.options.find(
    (opt) => opt.value === "wax_seal",
  );

  const SECTION_CLASS =
    "bg-white/80 backdrop-blur-md rounded-2xl p-8 md:p-8 border border-zinc-200 shadow-sm transition-all";

  if (modelValue && waxSealOption) {
    totalPrice += waxSealOption.price;
  }

  const currentDecoration = DECORATIONS.options.filter(
    (opt) =>
      decorationArray.some((d) => d.startsWith(opt.value)) &&
      opt.value !== "wax_seal",
  );

  currentDecoration.forEach((item) => {
    totalPrice += item.price;
  });

  const colorOption = COLORS.find((c) => c.value === configuration.color);
  const colorLabel = colorOption?.label || configuration.color;

  const handleCheckout = async () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    const validationResult = ShippingInfoSchema.safeParse({
      ...shippingInfo,
      invoice: invoiceInfo,
    });
    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0];
      return toast.error(firstIssue.message);
    }

    setIsPending(true);
    try {
      const { url } = await createCheckoutSession({
        configId: orderId,
        hasCard: showCustomCard,
        shippingInfo: shippingInfo,
        invoiceInfo: invoiceInfo,
      });

      if (url) {
        toast.success("訂單建立成功，準備跳轉至付款頁面...");
        localStorage.removeItem("shipping-info");
        localStorage.removeItem("invoice-info");
        window.location.href = url;
      }
    } catch (error) {
      console.error(error);
      toast.error("結帳出現問題", {
        description: "請檢查網路連線或稍後再試。",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-10 sm:py-20 bg-background min-h-screen text-foreground">
      <div className="max-w-6xl w-full px-6 lg:px-8">
        <div className="flex flex-col mb-8 gap-6">
          <BackButton className="w-fit">返回修改配置</BackButton>

          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
              Step 4
            </span>
            <h2 className="tracking-tight font-black text-3xl text-zinc-900">
              確認與結帳
            </h2>
          </div>
          <LoginModal
            isOpen={isLoginModalOpen}
            setIsOpen={setIsLoginModalOpen}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <section className={SECTION_CLASS}>
              <h3 className="text-lg font-bold mb-6 text-primary flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full" />
                收件人資訊
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-primary/80">
                    收件人姓名
                  </Label>
                  <Input
                    name="name"
                    value={shippingInfo.name}
                    onChange={handleInputChange}
                    className="h-12 rounded-lg bg-white border-zinc-300 "
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-primary/80">
                    聯絡電話
                  </Label>
                  <Input
                    name="phoneNumber"
                    value={shippingInfo.phoneNumber}
                    onChange={handleInputChange}
                    className="h-12 rounded-lg bg-white border-zinc-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-primary/80">
                    縣市
                  </Label>
                  <Select
                    value={shippingInfo.city}
                    onValueChange={(city) => {
                      const newInfo = {
                        ...shippingInfo,
                        city,
                        district: "",
                        postalCode: "",
                      };
                      setShippingInfo(newInfo);
                      localStorage.setItem(
                        "shipping-info",
                        JSON.stringify(newInfo),
                      );
                    }}
                  >
                    <SelectTrigger className="h-12 rounded-lg bg-white border-zinc-300">
                      <SelectValue placeholder="選擇縣市" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(TAIWAN_DATA).map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-primary/80">
                    鄉鎮市區 / 郵遞區號
                  </Label>
                  <div className="flex gap-2">
                    <Select
                      disabled={!shippingInfo.city}
                      value={shippingInfo.district}
                      onValueChange={(district) => {
                        const postalCode =
                          TAIWAN_DATA[shippingInfo.city][district];
                        const newInfo = {
                          ...shippingInfo,
                          district,
                          postalCode,
                        };
                        setShippingInfo(newInfo);
                        localStorage.setItem(
                          "shipping-info",
                          JSON.stringify(newInfo),
                        );
                      }}
                    >
                      <SelectTrigger className="h-12 rounded-lg bg-white border-zinc-300 flex-1">
                        <SelectValue placeholder="區域" />
                      </SelectTrigger>
                      <SelectContent>
                        {shippingInfo.city &&
                          Object.keys(TAIWAN_DATA[shippingInfo.city]).map(
                            (district) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ),
                          )}
                      </SelectContent>
                    </Select>
                    <Input
                      readOnly
                      value={shippingInfo.postalCode}
                      className="h-12 rounded-lg bg-zinc-100 border-zinc-300 w-20 text-center font-black text-zinc-500"
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-bold text-primary/80">
                    詳細地址
                  </Label>
                  <Input
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className="h-12 rounded-lg bg-white border-zinc-300"
                  />
                </div>
              </div>
            </section>

            <section className={SECTION_CLASS}>
              <h3 className="text-lg font-bold mb-6 text-primary flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full" />
                發票資訊
              </h3>
              <RadioGroup
                value={invoiceInfo.type}
                onValueChange={(val: "ELECTRONIC" | "COMPANY" | "PAPER") =>
                  handleInvoiceChange({
                    type: val,
                    value: "",
                    companyTitle: "",
                  })
                }
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
              >
                <div className="flex items-center space-x-3 border-2 rounded-xl p-4 cursor-pointer hover:bg-zinc-50 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <RadioGroupItem value="ELECTRONIC" id="electronic" />
                  <Label
                    htmlFor="electronic"
                    className="cursor-pointer font-bold text-primary"
                  >
                    電子載具
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border-2 rounded-xl p-4 cursor-pointer hover:bg-zinc-50 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <RadioGroupItem value="PAPER" id="paper" />
                  <Label
                    htmlFor="paper"
                    className="cursor-pointer font-bold text-primary"
                  >
                    個人紙本
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border-2 rounded-xl p-4 cursor-pointer hover:bg-zinc-50 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <RadioGroupItem value="COMPANY" id="company" />
                  <Label
                    htmlFor="company"
                    className="cursor-pointer font-bold text-primary"
                  >
                    公司三聯
                  </Label>
                </div>
              </RadioGroup>

              <div className="min-h-[100px]">
                {invoiceInfo.type === "ELECTRONIC" && (
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-primary/80">
                      載具編號
                    </Label>
                    <Input
                      value={invoiceInfo.value}
                      placeholder="例如: /ABC123D"
                      className="h-12 rounded-lg bg-white border-zinc-300"
                      onChange={(e) => {
                        let rawValue = e.target.value;

                        if (rawValue.trim() === "") {
                          handleInvoiceChange({ value: "" });
                          return;
                        }

                        let processedValue = rawValue.trim().toUpperCase();

                        if (
                          processedValue.length > 0 &&
                          processedValue[0] !== "/"
                        ) {
                          processedValue = "/" + processedValue;
                        }

                        handleInvoiceChange({ value: processedValue });
                      }}
                    />
                  </div>
                )}
                {invoiceInfo.type === "PAPER" && (
                  <div className="flex items-center gap-3 p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-200">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <p className="text-sm font-bold text-primary">
                      實體發票將隨禮盒一同寄出。
                    </p>
                  </div>
                )}
                {invoiceInfo.type === "COMPANY" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-primary/80">
                        公司抬頭
                      </Label>
                      <Input
                        value={invoiceInfo.companyTitle}
                        onChange={(e) =>
                          handleInvoiceChange({ companyTitle: e.target.value })
                        }
                        className="h-12 rounded-lg border-zinc-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-primary/80">
                        統一編號
                      </Label>
                      <Input
                        value={invoiceInfo.value}
                        maxLength={8}
                        inputMode="numeric"
                        onChange={(e) => {
                          const onlyHalfWidthNums = e.target.value.replace(
                            /[^0-9]/g,
                            "",
                          );

                          handleInvoiceChange({ value: onlyHalfWidthNums });
                        }}
                        className="h-12 rounded-lg bg-white border-zinc-300"
                      />
                      <p className="text-[11px] md:text-xs text-zinc-500 leading-relaxed">
                        *
                        若為政府機關或無統編單位，請改選「個人紙本」發票並於抬頭欄位註明。
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
            <section className={`${SECTION_CLASS} bg-zinc-50/30 border-dashed`}>
              <h3 className="text-lg font-bold mb-6 text-primary flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full" />
                服務與配送須知
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <InfoItem
                  icon={Truck}
                  title="全台快速配送"
                  description="完成付款後，我們將於 3-5 個工作天內為您出貨。客製化禮盒將經由專人檢查，以確保品質。"
                />
                <InfoItem
                  icon={ShieldCheck}
                  title="永續包裝與售後保障"
                  description="我們採用 100% 可回收環保包材。若收到商品有任何破損，請於 24 小時內聯繫客服，我們將立即為您處理。"
                />
                <InfoItem
                  icon={AlertCircle}
                  title="客製化小卡規範"
                  description="請務必確認小卡內容，一旦進入製作階段後，將無法修改圖片。"
                />
              </div>
            </section>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-10 h-fit space-y-10">
            <div className="bg-white/70 rounded-2xl p-8 border border-zinc-200 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
              <div className="relative w-full aspect-square bg-white/10 rounded-[2rem] border border-zinc-100 mb-8 flex items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 opacity-10 bg-[url('/paper-texture.jpg')] mix-blend-multiply" />
                <BoxPreview
                  color={configuration.color}
                  finish={configuration.finish}
                  occasion={configuration.occasion}
                  decoration={configuration.decoration ?? []}
                  className="h-4/5 w-auto transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-6 right-8 flex items-center gap-2 bg-white/70 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full shadow-sm z-10">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">
                    Your Design
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-black mb-6 tracking-tighter">
                訂單摘要
              </h3>
              <div className="space-y-5 mb-10">
                <SummaryRow
                  label="商品款式"
                  value={currentBoxSet?.label}
                  price={currentBoxSet?.price}
                  icon={Box}
                />
                <SummaryRow
                  label="表面工藝"
                  value={currentFinish?.label}
                  price={currentFinish?.price}
                  icon={Paintbrush}
                />
                {configuration.color && (
                  <SummaryRow
                    label="禮盒色系"
                    value={colorLabel || configuration.color}
                    icon={Palette}
                  />
                )}
                {modelValue && (
                  <SummaryRow
                    label="專屬蠟封"
                    price={waxSealOption?.price}
                    value={
                      MODELS.options.find((opt) => opt.value === modelValue)
                        ?.label
                    }
                    icon={Sparkles}
                  />
                )}

                {currentDecoration.map((d) => {
                  const isBotanical = d.value === "botanical";

                  const flowerName = isBotanical
                    ? d.variants?.find((v) => v.id == flowerId)?.name ||
                      "未知款式"
                    : null;
                  return (
                    <SummaryRow
                      key={d.value}
                      label="裝飾物"
                      value={
                        isBotanical
                          ? `${d.label} (${flowerName || `找不到ID:${flowerId}`})`
                          : d.label
                      }
                      price={d.price}
                      icon={Heart}
                    />
                  );
                })}
              </div>
              {imageUrl && (
                <div className="border-t border-zinc-100 pt-6 mb-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-primary" />
                      <span className="text-base font-black">附贈客製小卡</span>
                    </div>
                    <Switch
                      checked={showCustomCard}
                      onCheckedChange={setShowCustomCard}
                    />
                  </div>

                  {showCustomCard && (
                    <div className="flex flex-col items-center">
                      <div className="flex flex-col items-center justify-center p-0 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200 w-full min-h-[300px] overflow-hidden">
                        <div className="origin-center scale-[0.85] transition-transform duration-300">
                          <div className="relative w-64 h-[360px] bg-[#fdfcfb] rounded-sm p-6 shadow-xl border border-zinc-100 flex flex-col overflow-hidden">
                            <div
                              className="absolute inset-0 opacity-40 pointer-events-none"
                              style={{
                                backgroundImage: `url("/paper-texture.jpg")`,
                                backgroundSize: "cover",
                              }}
                            />

                            <div className="flex-1 flex flex-col justify-center">
                              <div className="relative w-fit max-w-full mx-auto max-h-[250px] bg-white p-2 shadow-sm border border-zinc-400 rotate-1 mb-8 z-10 flex items-center justify-center overflow-hidden">
                                <div className="w-full h-full relative flex items-center justify-center bg-zinc-50/50">
                                  <img
                                    src={imageUrl}
                                    alt="Card Preview"
                                    className="max-w-full max-h-full w-auto h-auto object-contain"
                                  />
                                </div>
                              </div>

                              <div className="w-full border-t border-dashed border-zinc-300 pt-12 flex flex-col justify-between relative z-10">
                                <div className="space-y-4">
                                  <div className="h-[1px] bg-zinc-100 w-full" />
                                  <div className="h-[1px] bg-zinc-100 w-full" />
                                  <div className="h-[1px] bg-zinc-100 w-3/4" />
                                </div>

                                <div className="pb-2 mt-4">
                                  <p className="text-[7px] text-zinc-300 text-right mt-1">
                                    Vegan Festbox Eco-friendly Paper
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="flex justify-between items-end mb-10">
                <span className="font-bold text-zinc-500 text-lg">
                  總計金額
                </span>
                <span className="text-5xl font-black text-primary">
                  ${totalPrice}
                </span>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={isPending}
                isLoading={isPending}
                loadingText="訂單處理中"
                size="lg"
                className="w-full group"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "立即結帳"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryRow = ({
  label,
  value,
  price,
  icon: Icon,
  image,
}: {
  label: string;
  value?: string;
  price?: number;
  icon?: any;
  image?: string;
}) => (
  <div className="flex items-center justify-between py-1 group">
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors flex items-center justify-center w-11 h-11">
        {image ? (
          <img
            src={image}
            alt={label}
            className="object-cover w-full h-full rounded-sm"
          />
        ) : (
          Icon && <Icon className="w-4.5 h-4.5 text-primary" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] text-mu font-bold uppercase tracking-wider leading-none mb-1">
          {label}
        </span>
        <span className="text-base font-bold text-primary/80">
          {value || "標準"}
        </span>
      </div>
    </div>
    {price !== undefined && (
      <span className="text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-full">
        {price > 0 ? `+$${price}` : "免費"}
      </span>
    )}
  </div>
);

export default DesignPreview;
