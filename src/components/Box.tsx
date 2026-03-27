import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
}

const Box = ({ imgSrc, className, ...props }: BoxProps) => {
  return (
    <div
      className={cn(
        "relative pointer-events-none z-50 overflow-hidden",
        "aspect-square rounded-2xl bg-card shadow-2xl ring-1 ring-stone-200/50",
        className,
      )}
      {...props}
    >
      <img
        className="object-cover w-full h-full select-none"
        src={imgSrc}
        alt="Vegan Festbox Unboxing Experience"
      />

      <div className="absolute inset-0 bg-stone-900/5 opacity-5 pointer-events-none" />
    </div>
  );
};

export default Box;
