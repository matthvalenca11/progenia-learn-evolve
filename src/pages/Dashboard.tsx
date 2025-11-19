import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  GraduationCap, 
  Trophy, 
  Clock, 
  BookOpen, 
  Zap, 
  Award, 
  TrendingUp, 
  UserPlus, 
  UserMinus, 
  Sparkles, 
  ArrowRight,
  Flame
} from "lucide-react";
import { toast } from "sonner";
import { enrollmentService } from "@/services/enrollmentService";
import { useCapsulasRecomendadas, useCapsulaInacabada } from "@/hooks/useCapsulas";
import { AppShell } from "@/components/layout/AppShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { ResponsiveGrid } from "@/components/layout/ResponsiveGrid";

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
  const [enrolledModules, setEnrolledModules] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | undefined>(undefined);

  const { capsulas: capsulaRecomendadas, loading: loadingRecomendadas } = useCapsulasRecomendadas(userId, 3);
  const { capsula: capsulaInacabada, loading: loadingInacabada } = useCapsulaInacabada(userId);
  const [capaUrls, setCapaUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      setUserId(session.user.id);

      // Fetch user profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      if (profileData) {
        setProfile(profileData);
      }

      // Fetch user stats
      const { data: statsData } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", session.user.id)
        .single();
      if (statsData) {
        setStats(statsData);
      }

      // Fetch modules and enrollments
      const { data: modulesData } = await supabase
        .from("modules")
        .select("*")
        .eq("published", true)
        .order("order_index");
      
      if (modulesData) {
        setModules(modulesData);
        
        const enrollments = await enrollmentService.getUserEnrollments(session.user.id);
        const enrolledModuleIds = new Set(enrollments.map(e => e.module_id));
        setEnrolledModules(enrolledModuleIds);

        // Compute completed modules
        if (enrolledModuleIds.size > 0) {
          const enrolledModuleIdsArray = Array.from(enrolledModuleIds);
          const { data: lessonsData } = await supabase
            .from("lessons")
            .select("id,module_id,published")
            .in("module_id", enrolledModuleIdsArray)
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

            (lessonsData || []).forEach((lesson: any) => {
              totals.set(lesson.module_id, (totals.get(lesson.module_id) || 0) + 1);
            });

            (progressData || []).forEach((p: any) => {
              const lesson = lessonsData?.find((l: any) => l.id === p.lesson_id);
              if (lesson && p.status === "concluido") {
                completed.set(lesson.module_id, (completed.get(lesson.module_id) || 0) + 1);
              }
            });

            let completedCount = 0;
            enrolledModuleIdsArray.forEach((mid) => {
              const t = totals.get(mid) || 0;
              const c = completed.get(mid) || 0;
              if (t > 0 && c === t) completedCount++;
            });

            setModulesCompleted(completedCount);
          }
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  // Load cover images
  useEffect(() => {
    const loadCapaUrls = async () => {
      const urls: Record<string, string> = {};
      for (const cap of capsulaRecomendadas) {
        if (cap.capa_path) {
          const { data } = await supabase.storage
            .from("lesson-assets")
            .createSignedUrl(cap.capa_path, 3600);
          if (data?.signedUrl) {
            urls[cap.id] = data.signedUrl;
          }
        }
      }
      setCapaUrls(urls);
    };

    if (capsulaRecomendadas.length > 0) {
      loadCapaUrls();
    }
  }, [capsulaRecomendadas]);

  const handleEnroll = async (moduleId: string) => {
    if (!userId) return;
    try {
      await enrollmentService.enrollInModule(userId, moduleId);
      setEnrolledModules(prev => new Set(prev).add(moduleId));
      toast.success("Matriculado com sucesso!");
    } catch {
      toast.error("Erro ao se matricular");
    }
  };

  const handleUnenroll = async (moduleId: string) => {
    if (!userId) return;
    try {
      await enrollmentService.unenrollFromModule(userId, moduleId);
      setEnrolledModules(prev => {
        const newSet = new Set(prev);
        newSet.delete(moduleId);
        return newSet;
      });
      toast.success("Desmatriculado com sucesso!");
    } catch {
      toast.error("Erro ao se desmatricular");
    }
  };

  if (loading) {
    return (
      <AppShell>
        <PageContainer>
          <div className="flex items-center justify-center min-h-[50vh]">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </PageContainer>
      </AppShell>
    );
  }

  const levelProgress = stats ? ((stats.total_xp % 1000) / 1000) * 100 : 0;

  return (
    <AppShell>
      <PageContainer maxWidth="2xl">
        {/* Welcome Header - Mobile Optimized */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                Olá, {profile?.full_name?.split(" ")[0] || "Estudante"}! 👋
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Continue sua jornada de aprendizado
              </p>
            </div>
            <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 border-primary">
              <AvatarFallback className="bg-gradient-accent text-white text-lg sm:text-xl">
                {profile?.full_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Stats Cards - Mobile Responsive Grid */}
        <ResponsiveGrid cols={{ default: 2, md: 4 }} gap="md" className="mb-6 md:mb-8">
          <Card className="touch-target">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-3 rounded-lg bg-secondary/10">
                  <Trophy className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground truncate">Level</p>
                  <p className="text-lg md:text-2xl font-bold">{stats?.level || 1}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="touch-target">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-3 rounded-lg bg-primary/10">
                  <Flame className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground truncate">Sequência</p>
                  <p className="text-lg md:text-2xl font-bold">{stats?.streak_days || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="touch-target">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-3 rounded-lg bg-accent/10">
                  <Zap className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground truncate">XP Total</p>
                  <p className="text-lg md:text-2xl font-bold">{stats?.total_xp || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="touch-target">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-3 rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground truncate">Módulos</p>
                  <p className="text-lg md:text-2xl font-bold">
                    {modulesCompleted}/{enrolledModules.size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ResponsiveGrid>

        {/* Level Progress Card */}
        <Card className="mb-6 md:mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl">Progresso do Nível</CardTitle>
            <CardDescription className="text-sm">
              Level {stats?.level || 1} • {stats?.total_xp || 0} XP
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={levelProgress} className="h-3" />
            <p className="text-xs md:text-sm text-muted-foreground mt-2">
              {Math.round((stats?.total_xp || 0) % 1000)} / 1000 XP para o próximo nível
            </p>
          </CardContent>
        </Card>

        {/* Continue Learning Section */}
        {capsulaInacabada && !loadingInacabada && (
          <Card className="mb-6 md:mb-8 gradient-accent text-white">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Continue de onde parou
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-base md:text-lg mb-1">
                    {capsulaInacabada.titulo}
                  </h3>
                  <p className="text-sm opacity-90 line-clamp-2">
                    {capsulaInacabada.pergunta_gatilho}
                  </p>
                </div>
                <Button
                  onClick={() => navigate(`/capsula/${capsulaInacabada.id}`)}
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommended Capsules */}
        {!loadingRecomendadas && capsulaRecomendadas.length > 0 && (
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Recomendado para você</h2>
            <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 3 }} gap="md">
              {capsulaRecomendadas.map((cap) => (
                <Card 
                  key={cap.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/capsula/${cap.id}`)}
                >
                  {capaUrls[cap.id] && (
                    <div className="aspect-video w-full bg-muted relative overflow-hidden">
                      <img
                        src={capaUrls[cap.id]}
                        alt={cap.titulo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-1">{cap.titulo}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {cap.pergunta_gatilho}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </ResponsiveGrid>
          </div>
        )}

        {/* Modules Section */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-4">Todos os Módulos</h2>
          <ResponsiveGrid cols={{ default: 1, lg: 2 }} gap="md">
            {modules.map((module) => {
              const isEnrolled = enrolledModules.has(module.id);
              return (
                <Card 
                  key={module.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg md:text-xl mb-2 line-clamp-2">
                          {module.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3">
                          {module.description}
                        </CardDescription>
                      </div>
                      {module.thumbnail_url && (
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                          <img 
                            src={module.thumbnail_url} 
                            alt={module.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-2">
                      {isEnrolled ? (
                        <>
                          <Button
                            onClick={() => navigate(`/modulo/${module.id}/capsulas`)}
                            className="flex-1"
                          >
                            <BookOpen className="mr-2 h-4 w-4" />
                            Acessar
                          </Button>
                          <Button
                            onClick={() => handleUnenroll(module.id)}
                            variant="outline"
                            className="flex-1 sm:flex-initial"
                          >
                            <UserMinus className="mr-2 h-4 w-4" />
                            Desmatricular
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleEnroll(module.id)}
                          className="w-full"
                          variant="outline"
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Matricular
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </ResponsiveGrid>
        </div>
      </PageContainer>
    </AppShell>
  );
};

export default Dashboard;
