"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button, type ButtonProps } from "./button";
import { cn } from "@/lib/utils";

export const BackButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "outline", size = "sm", ...props }, ref) => {
    const router = useRouter();
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn("gap-2 border-zinc-300 text-zinc-600 hover:text-primary bg-white", className)}
        onClick={(e) => {
          if (props.onClick) props.onClick(e);
          router.back();
        }}
        {...props}
      >
        <ChevronLeft className="w-4 h-4" />
        返回
      </Button>
    );
  }
);
BackButton.displayName = "BackButton";