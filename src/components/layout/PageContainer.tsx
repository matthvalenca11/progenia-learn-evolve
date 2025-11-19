import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
}

/**
 * Responsive page container with consistent padding and max-width
 */
export const PageContainer = ({ 
  children, 
  className,
  maxWidth = "xl",
  padding = "md"
}: PageContainerProps) => {
  const maxWidthClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full"
  };

  const paddingClasses = {
    none: "",
    sm: "px-4 py-4 md:px-6 md:py-6",
    md: "px-4 py-6 md:px-8 md:py-8",
    lg: "px-6 py-8 md:px-10 md:py-10"
  };

  return (
    <div 
      className={cn(
        "w-full mx-auto",
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
};
