import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, BookOpen, TrendingUp, User } from "lucide-react";

/**
 * Bottom navigation bar for mobile devices
 */
export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Início", path: "/dashboard" },
    { icon: BookOpen, label: "Módulos", path: "/dashboard" },
    { icon: TrendingUp, label: "Progresso", path: "/profile" },
    { icon: User, label: "Perfil", path: "/profile" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-mobile md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full",
                "touch-target no-tap-highlight transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 mb-1", active && "fill-primary/10")} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
