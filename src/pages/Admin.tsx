import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Users, 
  GraduationCap,
  Handshake,
  UsersRound,
  Beaker,
  Award,
  FlaskConical,
  Menu
} from "lucide-react";
import logo from "@/assets/logo.png";
import { toast } from "sonner";
import { LessonsManager } from "@/components/admin/LessonsManager";
import { PartnersManager } from "@/components/admin/PartnersManager";
import { TeamManager } from "@/components/admin/TeamManager";
import { UsersManager } from "@/components/admin/UsersManager";
import { GamificationManager } from "@/components/admin/GamificationManager";
import { ModulesManager } from "@/components/admin/ModulesManager";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import CapsulasList from "@/components/admin/CapsulasList";
import VirtualLabsAdmin from "./VirtualLabsAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (roleData?.role !== "admin") {
        toast.error("Acesso restrito a administradores");
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    };

    checkAdminAccess();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Verificando permissões...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-Friendly Navbar */}
      <nav className="sticky-header-mobile border-b border-border bg-background/95 backdrop-blur">
        <PageContainer padding="sm">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/dashboard")}>
              <img src={logo} alt="ProGenia" className="h-8 md:h-10" />
              <span className="text-lg md:text-xl font-bold gradient-text hidden sm:inline">
                ProGenia Admin
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => navigate("/dashboard")} className="hidden md:flex">
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => navigate("/profile")} className="hidden md:flex">
                Perfil
              </Button>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </PageContainer>
      </nav>

      {/* Main Content */}
      <PageContainer maxWidth="2xl" padding="md">
        <Tabs defaultValue="modules" className="w-full">
          {/* Mobile: Horizontal scrollable tabs */}
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <TabsList className="inline-flex w-max md:grid md:w-full md:grid-cols-9 gap-1 mb-6">
              <TabsTrigger value="modules" className="text-xs md:text-sm whitespace-nowrap">
                <BookOpen className="h-4 w-4 mr-1 md:mr-2" />
                Módulos
              </TabsTrigger>
              <TabsTrigger value="capsulas" className="text-xs md:text-sm whitespace-nowrap">
                <BookOpen className="h-4 w-4 mr-1 md:mr-2" />
                Cápsulas
              </TabsTrigger>
              <TabsTrigger value="lessons" className="text-xs md:text-sm whitespace-nowrap">
                <GraduationCap className="h-4 w-4 mr-1 md:mr-2" />
                Aulas
              </TabsTrigger>
              <TabsTrigger value="labs" className="text-xs md:text-sm whitespace-nowrap">
                <FlaskConical className="h-4 w-4 mr-1 md:mr-2" />
                Labs
              </TabsTrigger>
              <TabsTrigger value="media" className="text-xs md:text-sm whitespace-nowrap">
                <Beaker className="h-4 w-4 mr-1 md:mr-2" />
                Mídia
              </TabsTrigger>
              <TabsTrigger value="team" className="text-xs md:text-sm whitespace-nowrap">
                <UsersRound className="h-4 w-4 mr-1 md:mr-2" />
                Time
              </TabsTrigger>
              <TabsTrigger value="partners" className="text-xs md:text-sm whitespace-nowrap">
                <Handshake className="h-4 w-4 mr-1 md:mr-2" />
                Parceiros
              </TabsTrigger>
              <TabsTrigger value="users" className="text-xs md:text-sm whitespace-nowrap">
                <Users className="h-4 w-4 mr-1 md:mr-2" />
                Usuários
              </TabsTrigger>
              <TabsTrigger value="gamification" className="text-xs md:text-sm whitespace-nowrap">
                <Award className="h-4 w-4 mr-1 md:mr-2" />
                Badges
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="modules">
            <ModulesManager />
          </TabsContent>

          <TabsContent value="capsulas">
            <CapsulasList />
          </TabsContent>

          <TabsContent value="lessons">
            <LessonsManager />
          </TabsContent>

          <TabsContent value="labs">
            <VirtualLabsAdmin />
          </TabsContent>

          <TabsContent value="media">
            <MediaLibrary />
          </TabsContent>

          <TabsContent value="team">
            <TeamManager />
          </TabsContent>

          <TabsContent value="partners">
            <PartnersManager />
          </TabsContent>

          <TabsContent value="users">
            <UsersManager />
          </TabsContent>

          <TabsContent value="gamification">
            <GamificationManager />
          </TabsContent>
        </Tabs>
      </PageContainer>
    </div>
  );
};

export default Admin;
