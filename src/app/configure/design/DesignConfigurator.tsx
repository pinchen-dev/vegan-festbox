"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import NextImage from "next/image";
import {
  Radio,
  RadioGroup,
  Label as HeadlessLabel,
  Description as HeadlessDescription,
} from "@headlessui/react";
import { useState, useMemo } from "react";
import {
  COLORS,
  DECORATIONS,
  FINISHES,
  BOX_SETS,
  MODELS,
} from "@/validators/option-validators";
import { Label as ShadcnLabel } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Palette, Sparkles, Layers, ChevronRight, Check, ChevronsUpDown, ChevronLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useMutation } from "@tanstack/react-query";
import { saveConfig as _saveConfig, SaveConfigArgs } from "./actions";
import { useRouter } from "next/navigation";

const BOTANICAL_CONFIGS: Record<number, any> = {
  1: { rotate: -82, scale: 1.2, top: "12%", left: "24%", skew: 18 },
  2: { rotate: -68, scale: 1.4, top: "8%", left: "28%", skew: 22 },
  3: { rotate: -72, scale: 1.5, top: "9%", left: "20%", skew: 28 },
  4: { rotate: -60, scale: 1.2, top: "6%", left: "24%", skew: 14 },
  5: { rotate: -90, scale: 1.6, top: "4%", left: "30%", skew: 16 },
  6: { rotate: -120, scale: 1.7, top: "3%", left: "20%", skew: 26 },
  7: { rotate: -68, scale: 1.7, top: "12%", left: "18%", skew: 22 },
  8: { rotate: -78, scale: 1.7, top: "8%", left: "20%", skew: 18 },
  9: { rotate: -82, scale: 1.7, top: "12%", left: "22%", skew: 22 },
};

interface SelectedDecorations {
  twine: boolean;
  wax_seal: boolean;
  botanical: boolean;
}

interface DesignConfiguratorProps {
  configId: string;
  imageUrl: string;
  imageDimensions: { width: number; height: number };
}

const DesignConfigurator = ({ configId }: DesignConfiguratorProps) => {
  const router = useRouter();
  const [selectedBotanicalIndex, setSelectedBotanicalIndex] =
    useState<number>(1);
  const [selectedDecorations, setSelectedDecorations] =
    useState<SelectedDecorations>({
      twine: false,
      wax_seal: false,
      botanical: false,
    });

  const [options, setOptions] = useState({
    color: COLORS[0] as (typeof COLORS)[number],
    model: MODELS.options[0] as (typeof MODELS.options)[number],
    boxSet: BOX_SETS.options[0] as (typeof BOX_SETS.options)[number],
    finish: FINISHES.options[0] as (typeof FINISHES.options)[number],
  });

  const { mutate: saveConfig, isPending } = useMutation({
    mutationKey: ["save-config"],
    mutationFn: async (args: SaveConfigArgs) => await _saveConfig(args),
    onSuccess: () => router.push(`/configure/preview?id=${configId}`),
    onError: (error) => console.error("儲存失敗:", error),
  });

  const botanicalOption = DECORATIONS.options.find(
    (opt) => opt.value === "botanical",
  );
  const twineOption = DECORATIONS.options.find((opt) => opt.value === "twine");
  const adj = useMemo(
    () => BOTANICAL_CONFIGS[selectedBotanicalIndex],
    [selectedBotanicalIndex],
  );

  return (
    <div className="relative mt-10 grid grid-cols-1 lg:grid-cols-5 mb-20 pb-20 gap-y-8 lg:gap-x-8 items-start">
      <div className="relative h-[30rem] lg:h-[40rem] overflow-hidden col-span-1 lg:col-span-3 w-full flex items-center justify-center rounded-3xl border border-primary/10 bg-white/60 backdrop-blur-md shadow-sm lg:sticky lg:top-10">
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none p-12">
          <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
            <div className="relative w-full h-full">
              <div
                className="absolute inset-0 z-20 transition-colors duration-500"
                style={{
                  backgroundColor: options.color.hex,
                  maskImage: "url('/box.png')",
                  WebkitMaskImage: "url('/box.png')",
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                  maskPosition: "center",
                  WebkitMaskPosition: "center",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                  mixBlendMode: "multiply",
                }}
              />

              {options.finish.value !== "standard" && (
  <div
    className="absolute inset-0 z-25 transition-opacity duration-500"
    style={{
      backgroundImage: `url('/${options.finish.value === "recycled" ? "paper" : "linen"}-texture.jpg')`,
      backgroundSize: "cover",
      maskImage: "url('/box.png')",
      WebkitMaskImage: "url('/box.png')",
      maskSize: "contain",
      WebkitMaskSize: "contain",
      maskPosition: "center",
      WebkitMaskPosition: "center",
      maskRepeat: "no-repeat",
      WebkitMaskRepeat: "no-repeat",
      mixBlendMode: options.finish.value === "recycled" ? "multiply" : "overlay",
      opacity: options.finish.value === "recycled" ? 2.25 : 0.1,
    }}
  />
)}

              <NextImage
                src="/box.png"
                fill
                alt="box-base"
                className="pointer-events-none object-contain z-10"
                priority
              />

              {selectedDecorations.twine && (
                <div className="absolute inset-0 z-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <NextImage
                    src="/decorations/twine.png"
                    fill
                    alt="twine"
                    className="object-contain scale-[1.15] pointer-events-none"
                  />
                </div>
              )}

              {selectedDecorations.botanical && (
                <div className="absolute inset-0 z-30 pointer-events-none">
                  <div
                    className="relative w-[40%] aspect-square transition-all duration-300"
                    style={{
                      top: adj.top,
                      left: adj.left,
                      transform: `rotate(${adj.rotate}deg) skewX(${adj.skew}deg) scale(${adj.scale})`,
                      transformOrigin: "center center",
                    }}
                  >
                    <NextImage
                      src={`/decorations/botanical_${selectedBotanicalIndex}.png`}
                      fill
                      alt="botanical"
                      className="plant-perspective"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </div>
              )}

              {selectedDecorations.wax_seal && (
                <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none animate-in fade-in zoom-in-90 duration-500">
                  <div className="relative w-[18%] aspect-square mt-[-45%] ml-[2%]">
                    <NextImage
                      src={`/decorations/${options.model.value}.png`}
                      fill
                      alt="wax_seal"
                      className="seal-perspective object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full col-span-1 lg:col-span-2 flex flex-col bg-white/60 backdrop-blur-md border border-primary/10 rounded-3xl overflow-hidden shadow-sm mt-2 lg:mt-0 lg:sticky lg:top-24 lg:h-[40rem]">
        <div className="relative flex-1 min-h-0 w-full">
          <ScrollArea className="h-full w-full">
            <div className="px-8 pb-12 pt-8 lg:pb-12">
              <div className="flex items-center gap-2 mb-8">
        <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
          Step 3
        </span>
        <h2 className="tracking-tight font-black text-3xl text-zinc-900">
          訂製禮盒
        </h2>
      </div>

              <div className="flex flex-col gap-10">
                <RadioGroup
                  value={options.color}
                  onChange={(val) =>
                    setOptions((prev) => ({ ...prev, color: val }))
                  }
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Palette className="w-5 h-5 text-primary" />
                    <ShadcnLabel className="text-base font-bold text-zinc-800">
                      包裝底色: {options.color.label}
                    </ShadcnLabel>
                  </div>
                  <div className="flex items-center gap-1 space-x-4 ">
                    {COLORS.map((color) => (
                      <Radio
                        key={color.value}
                        value={color}
                        className={({ checked }) =>
                          cn(
                            "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-1 border-2 border-transparent transition-all",
                            { "border-primary scale-110": checked },
                          )
                        }
                      >
                        <span
                          style={{ backgroundColor: color.hex }}
                          className="h-10 w-10 rounded-full border border-black/10 shadow-inner"
                        />
                      </Radio>
                    ))}
                  </div>
                </RadioGroup>

                <RadioGroup
                  value={options.finish}
                  onChange={(val) =>
                    setOptions((prev) => ({ ...prev, finish: val }))
                  }
                >
                  <div className="flex items-center gap-2 mb-4">
  <Layers className="w-5 h-5 text-primary" />
                  <ShadcnLabel className="text-base font-bold text-zinc-800 block">
                    表面工藝
                  </ShadcnLabel>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                   
                    {FINISHES.options.map((option) => (
                      <Radio
                        key={option.value}
                        value={option}
                        className={({ checked }) =>
                          cn(
                            "relative block cursor-pointer rounded-xl bg-white px-6 py-4 border-2 border-zinc-200 transition-all",
                            { "border-primary bg-primary/5": checked },
                          )
                        }
                      >
                        <span className="flex justify-between items-center">
                          <HeadlessLabel className="font-bold text-zinc-900">
                            {option.label}
                          </HeadlessLabel>
                          <span className="text-primary font-black">
                            {option.price === 0
                              ? "免費"
                              : `+NT$${option.price}`}
                          </span>
                        </span>
                      </Radio>
                    ))}
                  </div>
                </RadioGroup>


                <div className="flex flex-col gap-3">
                   <div className="flex items-center gap-2 mt-4 mb-2">
  <Sparkles className="w-5 h-5 text-primary" />
  <ShadcnLabel className="text-base font-bold text-zinc-800">
    裝飾物
  </ShadcnLabel>
</div>
                  {[
                    {
                      option: { label: "搭配專屬蠟封", value: "wax_seal" },
                      price: 30,
                    },
                    { option: twineOption, price: 15 },
                    { option: botanicalOption, price: 45 },
                  ].map((item) => {
                    if (!item.option) return null;
                    const { option, price } = item;
                    const isSelected =
                      selectedDecorations[
                        option.value as keyof SelectedDecorations
                      ];

                    return (
                      <div
                        key={option.value}
                        className={cn(
                          "flex flex-col gap-3 p-5 rounded-xl border-2 border-zinc-200 transition-all cursor-pointer bg-white",
                          {
                            "border-primary bg-primary/[0.02] shadow-sm":
                              isSelected,
                          },
                        )}
                        onClick={() =>
                          setSelectedDecorations((prev) => ({
                            ...prev,
                            [option.value]: !isSelected,
                          }))
                        }
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-zinc-900">
                            {option.label}
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="text-primary font-black text-zinc-600">
                              {price === 0 ? "免費" : `+NT$${price}`}
                            </span>
                            <Switch
                              checked={isSelected}
                              onCheckedChange={(val) =>
                                setSelectedDecorations((prev) => ({
                                  ...prev,
                                  [option.value]: val,
                                }))
                              }
                            />
                          </div>
                        </div>

                        {option.value === "wax_seal" && isSelected && (
                          <div
                            className="mt-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-between h-12 px-4 border-zinc-200 rounded-lg bg-white hover:bg-zinc-50"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="relative h-6 w-6">
                                      <NextImage
                                        src={`/decorations/${options.model.value}.png`}
                                        fill
                                        alt="seal"
                                        className="object-contain"
                                      />
                                    </div>
                                    <span className="text-sm font-medium">
                                      {options.model.label}
                                    </span>
                                  </div>
                                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white shadow-xl rounded-xl z-[140]">
                                {MODELS.options.map((model) => (
                                  <DropdownMenuItem
                                    key={model.value}
                                    className={cn(
                                      "flex items-center gap-4 p-3 cursor-pointer",
                                      {
                                        "bg-zinc-50":
                                          model.value === options.model.value,
                                      },
                                    )}
                                    onClick={() =>
                                      setOptions((prev) => ({ ...prev, model }))
                                    }
                                  >
                                    <Check
                                      className={cn(
                                        "h-4 w-4 text-primary",
                                        model.value === options.model.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    <div className="relative h-6 w-6">
                                      <NextImage
                                        src={`/decorations/${model.value}.png`}
                                        fill
                                        alt={model.label}
                                        className="object-contain"
                                      />
                                    </div>
                                    <span className="text-sm">
                                      {model.label}
                                    </span>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}

                        {option.value === "botanical" && isSelected && (
                          <div
                            className="grid grid-cols-3 gap-2 mt-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {botanicalOption?.variants?.map((variant: any) => (
                              <button
                                key={variant.id}
                                type="button"
                                onClick={() =>
                                  setSelectedBotanicalIndex(variant.id)
                                }
                                className={cn(
                                  "py-2 rounded-lg text-xs font-black border-2 transition-all",
                                  selectedBotanicalIndex === variant.id
                                    ? "bg-zinc-900 text-white border-zinc-900"
                                    : "bg-white border-zinc-100 text-zinc-500 hover:border-zinc-300",
                                )}
                              >
                                {variant.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        <div className="w-full px-8 py-6 bg-white/80 backdrop-blur-sm border-t border-primary/10 flex justify-between items-center gap-4 shrink-0">
          <Button
            variant="ghost"
            size="lg"
            className="flex-1 cursor-pointer"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-4 h-4" />
            返回
          </Button>

          <Button
            disabled={isPending}
            size="lg"
            className="flex-1 group cursor-pointer"
    isLoading={isPending}
    loadingText="處理中..."
            onClick={() =>
              saveConfig({
                configId,
                color: options.color.value,
                finish: options.finish.value,
                boxSet: options.boxSet.value,
                occasion: options.model.value,
                decoration: Object.entries(selectedDecorations)
                  .filter(([_, selected]) => selected)
                  .map(([key, _]) => {
                    if (key === "botanical") {
                      return `botanical-${selectedBotanicalIndex}`;
                    }
                    return key;
                  }),
              })
            }
          >
            {isPending ? (
              <span className="flex items-center gap-2 ">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white " />
                處理中...
              </span>
            ) : (
              <>
                下一步
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform " />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DesignConfigurator;
