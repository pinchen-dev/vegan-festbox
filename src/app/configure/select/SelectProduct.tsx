"use client";

import { BOX_SETS } from "@/validators/option-validators";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Package,
  Leaf,
  Globe,
  Heart,
  ArrowUpDown,
} from "lucide-react";
import { useState, useMemo } from "react";

interface SelectProductProps {
  configId: string | null;
}

const SelectProduct = ({ configId }: SelectProductProps) => {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<string>("none");

  const sortedOptions = useMemo(() => {
    const options = [...BOX_SETS.options];
    if (sortBy === "price-asc") {
      return options.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-desc") {
      return options.sort((a, b) => b.price - a.price);
    }
    return options;
  }, [sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-primary/10 text-primary shadow-sm border border-primary/20 mb-8">
          <Leaf className="w-5 h-5" />
          <span className="text-sm font-black uppercase tracking-[0.15em]">
            100% Vegan & Cruelty-Free
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          挑選您的純素禮贈方案
        </h1>
        <p className="mt-4 text-lg text-primary/60 max-w-2xl mx-auto">
          從在地蔬果到職人手作，每一份選品都堅持純素、零殘忍與永續環保。
          <br />
          為您的重要時刻傳遞最誠摯的心意。
        </p>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
          Step 1
        </span>
        <h2 className="tracking-tight font-black text-3xl text-zinc-900">
          挑選商品
        </h2>
      </div>

      <div className="flex justify-end mb-8 items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-600">
          <ArrowUpDown className="w-4 h-4" />
          排序方式：
        </div>
        <select
          className="bg-white border border-primary/10 rounded-lg px-4 py-2 text-sm font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="none">預設排序</option>
          <option value="price-asc">價格：由低到高</option>
          <option value="price-desc">價格：由高到低</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-y-12 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
        {sortedOptions.map((option) => (
          <div
            key={option.value}
            className="group relative flex flex-col bg-white border border-primary/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-background">
              <NextImage
                src={(option as any).image || "/placeholder.jpg"}
                alt={option.label}
                fill
                className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <div className="flex flex-1 flex-col p-6">
              <div className="mb-4">
                <div className="flex justify-between items-end mb-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {option.label}
                  </h3>
                  <span className="text-primary font-bold text-lg">
                    {formatPrice(option.price)}
                  </span>
                </div>
                <p className="text-m text-zinc-500 leading-relaxed min-h-[40px]">
                  {option.description}
                </p>
              </div>

              <div className="space-y-4 mt-2 pt-4 border-t border-primary/10 flex-1">
                <div className="flex items-center gap-2 text-s font-bold text-primary/60 uppercase tracking-wider mb-2">
                  <Package className="w-3.5 h-3.5" />
                  內容包含
                </div>

                {(option as any).features?.map(
                  (feature: { title: string; desc: string }, idx: number) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <div className="flex items-start gap-2 text-m font-bold text-zinc-800">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>{feature.title}</span>
                      </div>
                      <p className="text-sm text-zinc-400 ml-6 leading-tight">
                        {feature.desc}
                      </p>
                    </div>
                  ),
                )}
              </div>

              <Button
                className="mt-8 w-full py-6 rounded-xl text-md font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                onClick={() => {
                  const query = new URLSearchParams();
                  if (configId) query.set("id", configId);
                  query.set("set", option.value);
                  router.push(`/configure/upload?${query.toString()}`);
                }}
              >
                選定此組合
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 pt-10 border-t border-primary/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10">
          <div className="flex flex-col items-center text-center">
            <Leaf className="w-8 h-8 text-primary mb-3" />
            <h4 className="font-bold text-base text-primary">100% 純素承諾</h4>
            <p className="text-sm text-zinc-500 mt-1">
              無動物成分，拒絕殘忍實驗
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <Globe className="w-8 h-8 text-primary mb-3" />
            <h4 className="font-bold text-base text-primary">友善環境包裝</h4>
            <p className="text-sm text-zinc-500 mt-1">
              FSC 認證紙材與大豆油墨印刷
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <Package className="w-8 h-8 text-primary mb-3" />
            <h4 className="font-bold text-base text-primary">支持在地產地</h4>
            <p className="text-sm text-zinc-500 mt-1">
              縮短碳足跡，支持永續小農
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <Heart className="w-8 h-8 text-primary mb-3" />
            <h4 className="font-bold text-base text-primary">客製化心意</h4>
            <p className="text-sm text-zinc-500 mt-1">
              專屬照片小卡，讓禮盒更有溫度
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectProduct;
