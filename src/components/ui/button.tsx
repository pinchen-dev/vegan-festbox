import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] font-bold tracking-tight active:scale-[0.98] cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/10",
        destructive: "bg-destructive text-white hover:bg-destructive/90 shadow-sm",
        outline: "border-2 border-primary/20 bg-background hover:bg-primary/5 hover:border-primary/30 text-primary",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-primary/5 text-primary",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 rounded-2xl text-base",
        sm: "h-9 px-4 rounded-xl text-sm gap-1.5",
        lg: "h-14 px-10 rounded-2xl text-md hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02]",
        icon: "size-12 rounded-2xl",
        "icon-sm": "size-9 rounded-xl",
        "icon-lg": "size-14 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, isLoading, loadingText, variant, children, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        {isLoading && loadingText ? loadingText : children}
        {isLoading ? (
          <span className="ml-1.5 flex items-center gap-1">
            <span className="animate-flashing w-1 h-1 bg-current rounded-full inline-block" />
            <span className="animate-flashing delay-100 w-1 h-1 bg-current rounded-full inline-block" />
            <span className="animate-flashing delay-200 w-1 h-1 bg-current rounded-full inline-block" />
          </span>
        ) : null}
      </Comp>
    );
  },
);
Button.displayName = "Button";



export { Button, buttonVariants };