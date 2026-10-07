import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button — adapted from shadcn/ui (MIT) with Ink & Brass tokens.
 * Origin: shadcn-ui/ui (MIT) — see ATTRIBUTIONS.md
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brass [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-brass text-ink hover:-translate-y-0.5 hover:bg-brass-bright hover:shadow-[0_6px_24px_rgba(195,154,69,0.35)]",
        outline: "border border-current/25 bg-transparent hover:-translate-y-0.5 hover:border-brass hover:text-brass-bright",
        ghost: "hover:bg-white/5",
      },
      size: {
        default: "h-12 px-7",
        sm: "h-9 px-5 text-xs",
        lg: "h-14 px-9 text-base",
        icon: "h-10 w-10 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };