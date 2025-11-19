import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  Home,
  BookOpen,
  User,
  Settings,
  LogOut,
  GraduationCap,
  FlaskConical,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { toast } from "sonner";

interface AppShellProps {
  children: ReactNode;
  showMobileNav?: boolean;
}

/**
 * App shell with mobile-friendly navigation drawer
 */
export const AppShell = ({ children, showMobileNav = true }: AppShellProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.signOut();
      toast.success("Logout realizado com sucesso");
      navigate("/auth");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  const menuItems = [
    { icon: Home, label: "Início", path: "/dashboard" },
    { icon: BookOpen, label: "Módulos", path: "/dashboard" },
    { icon: GraduationCap, label: "Meu Progresso", path: "/profile" },
    { icon: User, label: "Perfil", path: "/profile" },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Mobile Header */}
      {showMobileNav && (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-4">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Logo Section */}
                  <div className="p-6 border-b">
                    <img src={logo} alt="ProGenia" className="h-10" />
                  </div>

                  {/* Navigation */}
                  <nav className="flex-1 overflow-y-auto py-4">
                    <div className="space-y-1 px-3">
                      {menuItems.map((item) => (
                        <Button
                          key={item.path}
                          variant={isActivePath(item.path) ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start h-12 text-base",
                            isActivePath(item.path) && "bg-secondary/10 text-secondary font-medium"
                          )}
                          onClick={() => {
                            navigate(item.path);
                            setMobileMenuOpen(false);
                          }}
                        >
                          <item.icon className="mr-3 h-5 w-5" />
                          {item.label}
                        </Button>
                      ))}
                    </div>
                  </nav>

                  {/* User Actions */}
                  <div className="p-4 border-t space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-12 text-base"
                      onClick={() => {
                        navigate("/profile");
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Settings className="mr-3 h-5 w-5" />
                      Configurações
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-12 text-base text-destructive hover:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Sair
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo - centered on mobile */}
            <div className="flex-1 flex justify-center md:justify-start">
              <img 
                src={logo} 
                alt="ProGenia" 
                className="h-8 cursor-pointer"
                onClick={() => navigate("/dashboard")}
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
              >
                Início
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/profile")}
              >
                Perfil
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </nav>

            {/* Right side spacer for mobile symmetry */}
            <div className="w-10 md:hidden" />
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
