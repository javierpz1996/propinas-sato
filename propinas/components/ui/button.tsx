import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent text-sm font-medium whitespace-nowrap transition-colors duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]/35 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[#1a73e8] text-white shadow-sm hover:bg-[#1557b0] hover:shadow active:bg-[#174ea6]",
        outline:
          "border-[#dadce0] bg-white text-[#3c4043] hover:bg-[#f8f9fa] hover:border-[#d2d3d4] dark:border-white/20 dark:bg-transparent dark:text-foreground dark:hover:bg-white/10",
        secondary:
          "bg-[#f1f3f4] text-[#3c4043] hover:bg-[#e8eaed] dark:bg-white/10 dark:text-foreground dark:hover:bg-white/15",
        ghost:
          "text-[#1a73e8] hover:bg-[#e8f0fe] dark:hover:bg-[#1a73e8]/15",
        destructive:
          "bg-[#d93025] text-white hover:bg-[#c5221f] active:bg-[#a50e0e]",
        link: "text-[#1a73e8] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 gap-2 px-4",
        xs: "h-7 gap-1 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3.5 text-[0.8rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2 px-6 text-[0.9375rem]",
        icon: "size-9",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
