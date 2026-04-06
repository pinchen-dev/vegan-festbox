"use client";

import { COLORS } from "@/validators/option-validators";
import NextImage from "next/image";
import { cn } from "@/lib/utils";
import { Configuration } from "@prisma/client";

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

interface BoxPreviewProps {
  color?: string | null;
  finish?: string | null;
  occasion?: string | null;
  decoration?: string[] | null; 
  className?: string;
}

export const BoxPreview = ({
  color,
  finish,
  occasion,
  decoration,
  className,
}: BoxPreviewProps) => {
  const activeDecorations = decoration ?? [];
  const boxBaseImage = "/box.png";

  const selectedColorHex = COLORS.find((c) => c.value === color)?.hex || "#FFFFFF";

  const isRecycled = finish === "recycled";
  const isLinen = finish === "linen";

  const hasTwine = activeDecorations.includes("twine");
  const hasWaxSeal = activeDecorations.includes("wax_seal");
  const botanicalMatch = activeDecorations.find((d) => d.startsWith("botanical-"));
  const botanicalIndex = botanicalMatch ? parseInt(botanicalMatch.split("-")[1], 10) : null;
  const adj = botanicalIndex ? BOTANICAL_CONFIGS[botanicalIndex] : null;

  return (
    <div className={cn("relative aspect-square w-full flex items-center justify-center", className)}>
      <div className="relative w-full h-full max-w-[500px]">
        <div
          className="absolute inset-0 z-20"
          style={{
            backgroundColor: selectedColorHex,
            maskImage: `url(${boxBaseImage})`,
            WebkitMaskImage: `url(${boxBaseImage})`,
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            mixBlendMode: "multiply",
          }}
        />

        {(isRecycled || isLinen) && (
          <div
            className="absolute inset-0 z-25"
            style={{
              backgroundImage: `url('/${isRecycled ? "paper" : "linen"}-texture.jpg')`,
              backgroundSize: "cover",
              maskImage: `url(${boxBaseImage})`,
              WebkitMaskImage: `url(${boxBaseImage})`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskPosition: "center",
              WebkitMaskPosition: "center",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              mixBlendMode: isRecycled ? "multiply" : "overlay",
              opacity: isRecycled ? 2.25 : 0.1,
            }}
          />
        )}

        <NextImage src={boxBaseImage} fill alt="box-base" className="object-contain z-10" priority />

        {hasTwine && (
          <div className="absolute inset-0 z-20">
            <NextImage src="/decorations/twine.png" fill alt="twine" className="object-contain scale-[1.15]" />
          </div>
        )}

        {botanicalIndex && adj && (
          <div
            className="absolute z-30 w-[40%] aspect-square"
            style={{
              top: adj.top,
              left: adj.left,
              transform: `rotate(${adj.rotate}deg) skewX(${adj.skew}deg) scale(${adj.scale})`,
            }}
          >
            <NextImage src={`/decorations/botanical_${botanicalIndex}.png`} fill alt="botanical" className="object-contain" />
          </div>
        )}

        {hasWaxSeal && occasion && (
          <div className="absolute inset-0 z-40 flex items-center justify-center">
            <div className="relative w-[18%] aspect-square mt-[-45%] ml-[2%]"
           style={{ 
    transform: "perspective(1000px) rotateX(70deg) rotateY(-2deg) rotateZ(-37deg)",
    filter: "drop-shadow(-0.5px -0.5px 0.5px rgba(255, 255, 255, 0.4)) drop-shadow(1px 1px 1.5px rgba(0, 0, 0, 0.25)) drop-shadow(3px 3px 4px rgba(0, 0, 0, 0.1)) contrast(1.15) brightness(1.1) saturate(1.05)"
  }}
>
              <NextImage src={`/decorations/${occasion}.png`} fill alt="wax_seal" className="object-contain" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};