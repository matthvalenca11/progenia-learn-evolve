import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { gamificationService } from "@/services/gamificationService";
import { progressService } from "@/services/progressService";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { 
  User, 
  Award, 
  TrendingUp, 
  Trophy, 
  Clock,
  BookOpen,
  Lock,
  Flame,
  Zap
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ResponsiveGrid } from "@/components/layout/ResponsiveGrid";
import { BottomNav } from "@/components/layout/BottomNav";

const Profile = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [pointsHistory, setPointsHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      loadProfileData();
    }
  }, [user, authLoading, navigate]);

  const loadProfileData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [statsData, badgesData, progressData, historyData] = await Promise.all([
        gamificationService.getUserStats(user.id),
        gamificationService.getUserBadges(user.id),
        progressService.getUserProgress(user.id),
        progressService.getPointsHistory(user.id, 20),
      ]);

      setStats(statsData);
      setBadges(badgesData);
      setProgress(progressData);
      setPointsHistory(historyData);
    } catch (error) {
      console.error("Erro ao carregar dados do perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (newPassword === oldPassword) {
      toast.error("A nova senha deve ser diferente da atual");
      return;
    }

    try {
      setChangingPassword(true);

      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser?.user?.email) {
        toast.error("Erro ao obter informações do usuário");
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: currentUser.user.email,
        password: oldPassword,
      });

      if (signInError) {
        toast.error("Senha atual incorreta");
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        toast.error("Erro ao alterar senha");
      } else {
        toast.success("Senha alterada com sucesso!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast.error("Erro ao alterar senha");
    } finally {
      setChangingPassword(false);
    }
  };

  if (authLoading || loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando perfil...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  const levelProgress = stats?.total_xp 
    ? ((stats.total_xp % 100) / 100) * 100 
    : 0;
  const currentLevel = stats?.total_xp 
    ? Math.floor(Math.sqrt(stats.total_xp / 100))
    : 0;

  return (
    <>
      <PageContainer maxWidth="2xl" className="pb-20 md:pb-8">
        {/* Profile Header - Mobile Optimized */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl sm:text-4xl font-bold flex-shrink-0">
                {profile?.full_name?.charAt(0) || "U"}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold">{profile?.full_name || "Usuário"}</h1>
                  <Badge variant="outline" className="text-sm">Nível {currentLevel}</Badge>
                </div>
                
                {profile?.institution && (
                  <p className="text-sm md:text-base text-muted-foreground mb-2">
                    📍 {profile.institution}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-primary" />
                    <span>{stats?.total_xp || 0} XP</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span>{stats?.streak_days || 0} dias</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4 text-secondary" />
                    <span>{stats?.modules_completed || 0} módulos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium">Nível {currentLevel}</span>
                <span className="text-muted-foreground">
                  {Math.round((stats?.total_xp || 0) % 100)} / 100 XP
                </span>
              </div>
              <Progress value={levelProgress} className="h-2" />
            </div>
          </div>

          {/* Stats Grid */}
          <ResponsiveGrid cols={{ default: 2, sm: 2, md: 4 }} gap="md" className="mb-6 md:mb-8">
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-3 rounded-lg bg-primary/10">
                    <Trophy className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground truncate">Badges</p>
                    <p className="text-lg md:text-2xl font-bold">{badges.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-3 rounded-lg bg-secondary/10">
                    <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground truncate">XP Total</p>
                    <p className="text-lg md:text-2xl font-bold">{stats?.total_xp || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-3 rounded-lg bg-accent/10">
                    <Clock className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground truncate">Tempo</p>
                    <p className="text-lg md:text-2xl font-bold">{stats?.total_time_minutes || 0}m</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-3 rounded-lg bg-primary/10">
                    <Flame className="h-5 w-5 md:h-6 md:w-6 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground truncate">Sequência</p>
                    <p className="text-lg md:text-2xl font-bold">{stats?.streak_days || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ResponsiveGrid>

          {/* Tabs - Mobile Optimized */}
          <Tabs defaultValue="badges" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="badges" className="text-xs sm:text-sm">
                <Award className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Badges</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs sm:text-sm">
                <TrendingUp className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Histórico</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs sm:text-sm">
                <Lock className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Senha</span>
              </TabsTrigger>
            </TabsList>

            {/* Badges Tab */}
            <TabsContent value="badges">
              <ResponsiveGrid cols={{ default: 2, sm: 3, lg: 4 }} gap="md">
                {badges.map((badge: any) => (
                  <Card key={badge.id} className="text-center">
                    <CardContent className="p-4">
                      <div className="text-4xl mb-2">{badge.icon || "🏆"}</div>
                      <h3 className="font-semibold text-sm mb-1">{badge.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {badge.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
                {badges.length === 0 && (
                  <Card className="col-span-full">
                    <CardContent className="p-8 text-center">
                      <Award className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground">Nenhum badge conquistado ainda</p>
                    </CardContent>
                  </Card>
                )}
              </ResponsiveGrid>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Histórico de Pontos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pointsHistory.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.descricao}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={item.pontos > 0 ? "default" : "secondary"} className="ml-2">
                          {item.pontos > 0 ? "+" : ""}{item.pontos} XP
                        </Badge>
                      </div>
                    ))}
                    {pointsHistory.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        Nenhuma atividade recente
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Alterar Senha
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="old-password">Senha Atual</Label>
                      <Input
                        id="old-password"
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        className="touch-target"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nova Senha</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="touch-target"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="touch-target"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={changingPassword}
                      className="w-full touch-target"
                    >
                      {changingPassword ? "Alterando..." : "Alterar Senha"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
        </Tabs>
      </PageContainer>
      <BottomNav />
    </>
  );
};

export default Profile;
