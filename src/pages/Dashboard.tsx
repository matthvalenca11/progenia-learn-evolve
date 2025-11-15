import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GraduationCap, Trophy, Clock, BookOpen, LogOut, Zap, Award, TrendingUp } from "lucide-react";
import logo from "@/assets/logo.png";
import { toast } from "sonner";
import AITutor from "@/components/AITutor";
interface UserProfile {
  full_name: string;
  institution?: string;
}
interface UserStats {
  total_xp: number;
  level: number;
  streak_days: number;
  modules_completed: number;
  total_time_minutes: number;
}
interface Module {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: string;
  thumbnail_url?: string;
}
const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [modulesCompleted, setModulesCompleted] = useState<number>(0);
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Fetch user profile
      const {
        data: profileData
      } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      if (profileData) {
        setProfile(profileData);
      }

      // Fetch user stats
      const {
        data: statsData
      } = await supabase.from("user_stats").select("*").eq("user_id", session.user.id).single();
      if (statsData) {
        setStats(statsData);
      }

      // Fetch available modules
      const {
        data: modulesData
      } = await supabase
        .from("modules")
        .select("*")
        .eq("published", true)
        .order("order_index");
      if (modulesData) {
        setModules(modulesData);

        // Compute modules completed based on lesson progress
        if (modulesData.length > 0) {
          const moduleIds = modulesData.map((m) => m.id);
          const { data: lessonsData } = await supabase
            .from("lessons")
            .select("id,module_id,published")
            .in("module_id", moduleIds)
            .eq("published", true);

          const lessonIds = (lessonsData || []).map((l: any) => l.id);
          if (lessonIds.length > 0) {
            const { data: progressData } = await supabase
              .from("lesson_progress")
              .select("lesson_id,status")
              .eq("user_id", session.user.id)
              .in("lesson_id", lessonIds);

            const totals = new Map<string, number>();
            const completed = new Map<string, number>();

            (lessonsData || []).forEach((l: any) => {
              totals.set(l.module_id, (totals.get(l.module_id) || 0) + 1);
            });

            (progressData || []).forEach((p: any) => {
              const lesson = (lessonsData || []).find((l: any) => l.id === p.lesson_id);
              if (lesson && p.status === "concluido") {
                completed.set(
                  lesson.module_id,
                  (completed.get(lesson.module_id) || 0) + 1
                );
              }
            });

            let count = 0;
            totals.forEach((total, moduleId) => {
              if (total > 0 && (completed.get(moduleId) || 0) >= total) {
                count++;
              }
            });
            setModulesCompleted(count);
          } else {
            setModulesCompleted(0);
          }
        } else {
          setModulesCompleted(0);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Saiu com sucesso");
    navigate("/");
  };
  const handleStartModule = async (moduleId: string) => {
    navigate(`/module/${moduleId}`);
  };
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando seu painel...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="ProGenia" className="h-10" />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/admin")}>
              Admin
            </Button>
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {profile ? getInitials(profile.full_name) : "U"}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Bem-vindo de volta, {profile?.full_name}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Continue sua jornada de aprendizado
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="h-8 w-8 text-secondary" />
              <span className="text-2xl font-bold">{stats?.total_xp || 0}</span>
            </div>
            <p className="text-sm text-muted-foreground">XP Total</p>
            <p className="text-xs text-muted-foreground mt-1">Nível {stats?.level || 1}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Zap className="h-8 w-8 text-accent" />
              <span className="text-2xl font-bold">{stats?.streak_days || 0}</span>
            </div>
            <p className="text-sm text-muted-foreground">Sequência de Dias</p>
            <p className="text-xs text-muted-foreground mt-1">Continue assim!</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">{modulesCompleted}</span>
            </div>
            <p className="text-sm text-muted-foreground">Módulos Concluídos</p>
            <p className="text-xs text-muted-foreground mt-1">De {modules.length}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-8 w-8 text-secondary" />
              <span className="text-2xl font-bold">{Math.floor((stats?.total_time_minutes || 0) / 60)}</span>
            </div>
            <p className="text-sm text-muted-foreground">Horas de Estudo</p>
            <p className="text-xs text-muted-foreground mt-1">Este mês</p>
          </Card>
        </div>

        {/* Learning Progress */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold mb-1">Seu Progresso</h2>
              <p className="text-muted-foreground">
                {modulesCompleted} de {modules.length} módulos concluídos
              </p>
            </div>
            <Award className="h-10 w-10 text-secondary" />
          </div>
          <Progress value={modules.length > 0 ? (modulesCompleted / modules.length) * 100 : 0} className="h-3" />
        </Card>

        {/* Available Modules */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Módulos de Aprendizado</h2>
            
          </div>

          {modules.length === 0 ? <Card className="p-12 text-center">
              <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum Módulo Disponível Ainda</h3>
              <p className="text-muted-foreground">
                Volte em breve! Os administradores estão preparando conteúdo de aprendizado para você.
              </p>
            </Card> : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map(module => <Card key={module.id} className="overflow-hidden hover:shadow-xl transition-smooth group cursor-pointer">
                  <div className="h-48 bg-gradient-accent relative overflow-hidden">
                    {module.thumbnail_url ? <img src={module.thumbnail_url} alt={module.title} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center">
                        <GraduationCap className="h-20 w-20 text-white/30" />
                      </div>}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary/10 text-secondary">
                        {module.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-smooth">
                      {module.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {module.description}
                    </p>
                    <Button className="w-full" variant="outline" onClick={() => handleStartModule(module.id)}>
                      Começar a Aprender
                    </Button>
                  </div>
                </Card>)}
            </div>}
        </div>
      </div>

      <AITutor />
    </div>;
};
export default Dashboard;