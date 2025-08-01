import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/app/lib/utils";
import { LoadIcon } from "@/app/shared/loading";

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-line bg-background hover:bg-accent hover:text-accent-foreground",
        outline_rounded:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-full",
        rounded: "rounded-full bg-primary text-white hover:bg-primary/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[52px] px-4 py-[14px] text-title-m",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-8 text-title-m",
        rounded_lg: "h-11 px-8 text-title-s",
        icon: "h-10 w-10",
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
  loading?: boolean; // 로딩 중인지 여부
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <>
        {loading ? (
          <Comp
            disabled={loading}
            className={cn(
              buttonVariants({ variant, size, className }),
              "relative",
            )}
            ref={ref}
            {...props}
          >
            <LoadIcon type="button" />
          </Comp>
        ) : (
          <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
          />
        )}
      </>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
