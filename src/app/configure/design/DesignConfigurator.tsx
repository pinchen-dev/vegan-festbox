"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import NextImage from "next/image";
import {
  Radio,
  RadioGroup,
  Label as HeadlessLabel,
  Description,
} from "@headlessui/react";
import { useState, useMemo } from "react";
import {
  COLORS,
  DECORATIONS,
  FINISHES,
  BOX_SETS,
  MODELS,
} from "@/validators/option-validators";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Palette,
  Sparkles,
  ArrowRight,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { useMutation } from "@tanstack/react-query";
import { saveConfig as _saveConfig, SaveConfigArgs } from "./actions";
import { useRouter } from "next/navigation";

const BOTANICAL_CONFIGS: Record<number, any> = {
  1: { rotate: -55, scale: 1.3, top: "10%", left: "28%", skew: 30 },
  2: { rotate: -80, scale: 1.4, top: "21%", left: "49%", skew: 22 },
  3: { rotate: -70, scale: 1.2, top: "25%", left: "45%", skew: 15 },
  4: { rotate: -75, scale: 1.5, top: "22%", left: "48%", skew: 20 },
  5: { rotate: -60, scale: 1.6, top: "23%", left: "47%", skew: 17 },
  6: { rotate: -85, scale: 1.4, top: "20%", left: "50%", skew: 25 },
  7: { rotate: -72, scale: 1.3, top: "24%", left: "48%", skew: 19 },
  8: { rotate: -78, scale: 1.5, top: "22%", left: "49%", skew: 21 },
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
    color: COLORS[0],
    model: MODELS.options[0],
    boxSet: BOX_SETS.options[0],
    finish: FINISHES.options[0],
  });

  const { mutate: saveConfig, isPending } = useMutation({
    mutationKey: ["save-config"],
    mutationFn: async (args: SaveConfigArgs) => {
      return await _saveConfig(args);
    },
    onSuccess: () => {
      router.push(`/configure/preview?id=${configId}`);
    },
    onError: (error) => {
      console.error("儲存失敗:", error);
    },
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
    <div className="relative mt-10 grid grid-cols-1 lg:grid-cols-3 mb-20 pb-20 gap-x-8 items-start">
      <div className="relative h-[30rem] lg:h-[40rem] overflow-hidden col-span-2 w-full flex items-center justify-center rounded-3xl border border-zinc-200 bg-zinc-50/50 lg:sticky lg:top-10">
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
                    mixBlendMode:
                      options.finish.value === "recycled"
                        ? "multiply"
                        : "overlay",
                    opacity: options.finish.value === "recycled" ? 0.8 : 0.5,
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
                <div className="absolute inset-0 z-40 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <NextImage
                    src="/decorations/twine.png"
                    fill
                    alt="twine"
                    className="object-cover scale-[1.02]"
                  />
                </div>
              )}

              {selectedDecorations.botanical && (
                <div className="absolute inset-0 z-40 pointer-events-none">
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
                <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none animate-in fade-in zoom-in-90 duration-500">
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

      <div className="w-full col-span-full lg:col-span-1 flex flex-col bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm mt-8 lg:mt-0">
        <ScrollArea className="relative flex-1 h-[35rem]">
          <div className="px-8 pb-12 pt-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                Step 3
              </span>
              <h2 className="tracking-tight font-black text-3xl text-zinc-900">
                最後修飾
              </h2>
            </div>{" "}
            <div className="flex flex-col gap-10">
              <RadioGroup
                value={options.color}
                onChange={(val) =>
                  setOptions((prev) => ({ ...prev, color: val }))
                }
              >
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="w-5 h-5 text-primary" />
                  <Label className="text-base font-bold text-zinc-800">
                    包裝底色: {options.color.label}
                  </Label>
                </div>
                <div className="flex items-center space-x-4">
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
                <Label className="text-base font-bold text-zinc-800 mb-4 block">
                  表面工藝
                </Label>
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
                          {option.price === 0 ? "免費" : `+NT$${option.price}`}
                        </span>
                      </span>
                    </Radio>
                  ))}
                </div>
              </RadioGroup>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3 p-5 rounded-2xl border-2 border-zinc-200 bg-zinc-50/30">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-bold text-zinc-800">
                      搭配專屬蠟封
                    </Label>
                    <Switch
                      checked={selectedDecorations.wax_seal}
                      onCheckedChange={(val) =>
                        setSelectedDecorations((prev) => ({
                          ...prev,
                          wax_seal: val,
                        }))
                      }
                    />
                  </div>

                  {selectedDecorations.wax_seal && (
                    <div className="mt-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between h-14 px-4 border-zinc-200 rounded-xl bg-white"
                          >
                            <div className="flex items-center gap-4">
                              <div className="relative h-8 w-8">
                                <NextImage
                                  src={`/decorations/${options.model.value}.png`}
                                  fill
                                  alt="seal"
                                  className="object-contain"
                                />
                              </div>
                              <span className="font-bold">
                                {options.model.label}
                              </span>
                            </div>
                            <ChevronsUpDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white shadow-xl rounded-xl">
                          {MODELS.options.map((model) => (
                            <DropdownMenuItem
                              key={model.value}
                              className={cn(
                                "flex items-center gap-4 p-4 cursor-pointer",
                                {
                                  "bg-zinc-50 font-bold":
                                    model.value === options.model.value,
                                },
                              )}
                              onClick={() =>
                                setOptions((prev) => ({
                                  ...prev,
                                  decoration: model,
                                }))
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
                              <div className="relative h-8 w-8">
                                <NextImage
                                  src={`/decorations/${model.value}.png`}
                                  fill
                                  alt={model.label}
                                  className="object-contain"
                                />
                              </div>
                              <span>{model.label}</span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  {[twineOption, botanicalOption].map((option) => {
                    if (!option) return null;
                    const isSelected =
                      selectedDecorations[
                        option.value as keyof SelectedDecorations
                      ];
                    return (
                      <div
                        key={option.value}
                        className={cn(
                          "flex flex-col gap-3 p-5 rounded-xl border-2 border-zinc-200 transition-all",
                          { "border-primary bg-primary/5": isSelected },
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{option.label}</span>
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
                        {option.value === "botanical" && isSelected && (
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            {botanicalOption?.variants?.map((variant: any) => (
                              <button
                                key={variant.id}
                                onClick={() =>
                                  setSelectedBotanicalIndex(variant.id)
                                }
                                className={cn(
                                  "py-2 rounded-lg text-xs font-black border-2 transition-all",
                                  selectedBotanicalIndex === variant.id
                                    ? "bg-zinc-900 text-white border-zinc-900"
                                    : "bg-white border-zinc-100",
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
          </div>
        </ScrollArea>

        <div className="w-full px-8 py-6 bg-white border-t">
          <Button
            disabled={isPending}
            size="lg"
            className="w-full h-14 rounded-2xl text-lg font-bold bg-zinc-900 text-white active:scale-95 transition-all cursor-pointer"
            onClick={() =>
              saveConfig({
                configId,
                color: options.color.value,
                finish: options.finish.value,
                boxSet: options.boxSet.value,
                occasion: options.model.value,
                decoration: Object.entries(selectedDecorations)
                  .filter(([_, selected]) => selected)
                  .map(([key]) => key),
              })
            }
          >
            {isPending ? "處理中..." : "下一步"}{" "}
            <ArrowRight className="h-5 w-5 ml-2 r" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DesignConfigurator;
