import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: "sm" | "md" | "lg" | "xl";
}

/**
 * Responsive grid with mobile-first breakpoints
 */
export const ResponsiveGrid = ({ 
  children, 
  className,
  cols = { default: 1, sm: 1, md: 2, lg: 3, xl: 4 },
  gap = "md"
}: ResponsiveGridProps) => {
  const colsClasses = cn(
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`
  );

  const gapClasses = {
    sm: "gap-2 md:gap-3",
    md: "gap-4 md:gap-6",
    lg: "gap-6 md:gap-8",
    xl: "gap-8 md:gap-10"
  };

  return (
    <div 
      className={cn(
        "grid",
        colsClasses,
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
};
