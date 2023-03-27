import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const cardContainerVariants = cva(
  "p-3 bg-white shadow-lg shadow-slate-300/30 border border-slate-300/20",
  {
    variants: {
      variant: {
        default: "rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardContainerProps
  extends React.DetailsHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardContainerVariants> {}

const CardContainer = forwardRef<HTMLDivElement, CardContainerProps>(
  ({ className, children, variant, ...props }, ref) => {
    return (
      <div
        className={cn(cardContainerVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContainer.displayName = "CardContainer";

export { CardContainer, cardContainerVariants };
