import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

/**
 * Mobile-first layout wrapper with safe areas and responsive padding
 */
export const MobileLayout = ({ children, className, fullWidth = false }: MobileLayoutProps) => {
  return (
    <div 
      className={cn(
        "min-h-screen flex flex-col",
        "safe-area-mobile",
        className
      )}
    >
      <div className={cn(
        "flex-1 flex flex-col",
        !fullWidth && "container-mobile"
      )}>
        {children}
      </div>
    </div>
  );
};
