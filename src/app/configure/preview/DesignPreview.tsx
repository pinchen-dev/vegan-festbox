"use client";

import { DECORATIONS, BOX_SETS, FINISHES, MODELS } from "@/validators/option-validators";
import { Configuration } from "@prisma/client";
import { Check, ArrowRight, ShieldCheck, Leaf, Heart, Image as ImageIcon, Box, Paintbrush, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import NextImage from "next/image";

const DesignPreview = ({ configuration }: { configuration: Configuration }) => {
  const { decoration, boxSet, finish, imageUrl, occasion } = configuration;
  const [showCustomCard, setShowCustomCard] = useState(!!imageUrl);

  const BASE_PRICE = 500;
  let totalPrice = BASE_PRICE;

  const currentBoxSet = BOX_SETS.options.find((opt) => opt.value === boxSet);
  if (currentBoxSet) totalPrice += currentBoxSet.price;

  const currentFinish = FINISHES.options.find((opt) => opt.value === finish);
  if (currentFinish) totalPrice += currentFinish.price;

  const currentModel = MODELS.options.find((opt) => opt.value === occasion);
  const selectedDecorations = DECORATIONS.options.filter((opt) => decoration.includes(opt.value));
  selectedDecorations.forEach((item) => { totalPrice += item.price; });

  const handleCheckout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: totalPrice,
        itemNames: `Vegan Festbox - ${currentBoxSet?.label}`,
        useCustomCard: showCustomCard
      }),
    });
    const { form } = await res.json();
    const div = document.createElement("div");
    div.innerHTML = form;
    document.body.appendChild(div);
    div.querySelector("form")?.submit();
  };

  return (
    <div className="flex flex-col items-center py-10 sm:py-20 bg-[#f9f8f3] min-h-screen">
      <div className="max-w-6xl w-full px-6 lg:px-8">
        
        <div className="flex items-center gap-2 mb-2">
        <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Step 4</span>
        <h2 className="tracking-tight font-black text-3xl text-zinc-900">確認與結帳</h2>
      </div>


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-zinc-100">
              <div className="relative aspect-[16/9] w-full max-w-md mx-auto overflow-hidden rounded-2xl bg-[#f9f8f3] mb-8 border border-zinc-50">
                <NextImage 
                  src={`/sets/${boxSet}.png`} 
                  fill 
                  alt="Product Preview" 
                  className="object-contain p-6"
                  priority
                />
              </div>

              <div className="space-y-1 divide-y divide-zinc-50">
                <SummaryRow label="禮盒款式" value={currentBoxSet?.label} price={currentBoxSet?.price} icon={Box} />
                <SummaryRow label="表面工藝" value={currentFinish?.label} price={currentFinish?.price} icon={Paintbrush} />
                {currentModel && <SummaryRow label="專屬蠟封" value={currentModel.label} icon={Sparkles} />}
                {selectedDecorations.map(d => (
                  <SummaryRow key={d.value} label="追加裝飾" value={d.label} price={d.price} icon={Heart} />
                ))}
              </div>
            </div>

            <div className={cn(
              "p-6 rounded-[2rem] transition-all border bg-white",
              showCustomCard ? "border-primary/20 ring-1 ring-primary/5" : "border-zinc-100"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn("p-2 rounded-lg", showCustomCard ? "bg-primary/10 text-primary" : "bg-zinc-100 text-zinc-400")}>
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">客製小卡預覽</h4>
                    <p className="text-[10px] text-zinc-400 font-medium">包含在禮盒中的專屬卡片</p>
                  </div>
                </div>
                <Switch checked={showCustomCard} onCheckedChange={setShowCustomCard} disabled={!imageUrl} />
              </div>

              {showCustomCard && imageUrl && (
                <div className="mt-6 flex justify-center animate-in fade-in slide-in-from-top-2">
                  <div className="relative aspect-[3/2] w-full max-w-[280px] rounded-lg overflow-hidden shadow-md border-4 border-white">
                    <NextImage src={imageUrl} fill alt="Custom Card" className="object-cover" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-10">
            <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 shadow-xl shadow-zinc-200/40">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Order Summary</span>
                <Leaf className="w-5 h-5 text-primary" />
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-zinc-500 font-bold text-xs uppercase tracking-widest">
                  <span>基礎金額</span>
                  <span>${BASE_PRICE}</span>
                </div>
                <div className="flex justify-between text-zinc-500 font-bold text-xs uppercase tracking-widest">
                  <span>客製加總</span>
                  <span className="text-primary">+${totalPrice - BASE_PRICE}</span>
                </div>
                <div className="h-px bg-zinc-100 my-4" />
                <div className="flex justify-between items-baseline">
                  <span className="text-xl font-black text-zinc-900">總計金額</span>
                  <div className="text-right flex items-baseline gap-1">
                    <span className="text-xs font-bold text-zinc-400 uppercase">TWD</span>
                    <span className="text-4xl font-black text-zinc-900 tracking-tighter">${totalPrice}</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleCheckout}
                className="w-full h-16 text-lg font-black rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white transition-all group shadow-lg cursor-pointer"
              >
                確認結帳
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <div className="mt-8 flex flex-col items-center gap-4 pt-6 border-t border-zinc-50">
                <div className="flex items-center gap-2 opacity-30">
                  <ShieldCheck className="w-4 h-4" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Secured Checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value, price, icon: Icon }: { label: string; value?: string; price?: number; icon?: any }) => (
  <div className="flex items-center justify-between py-5 group transition-all">
    <div className="flex items-center gap-4">
      {Icon && <Icon className="w-4 h-4 text-zinc-300 group-hover:text-primary transition-colors" />}
      <div>
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-zinc-900">{value || "標準"}</p>
      </div>
    </div>
    <div className="text-right">
      {price && price > 0 ? (
        <span className="text-xs font-black text-primary bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
          +${price}
        </span>
      ) : (
        <Check className="w-4 h-4 text-zinc-200" />
      )}
    </div>
  </div>
);

export default DesignPreview;