import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  BookOpen, 
  Users, 
  BarChart, 
  Settings,
  Home,
  Save,
  GraduationCap,
  Handshake,
  UsersRound,
  Beaker,
  Award
} from "lucide-react";
import logo from "@/assets/logo.png";
import { toast } from "sonner";
import { z } from "zod";
import { LessonsManager } from "@/components/admin/LessonsManager";
import { PartnersManager } from "@/components/admin/PartnersManager";
import { TeamManager } from "@/components/admin/TeamManager";
import { UsersManager } from "@/components/admin/UsersManager";
import { GamificationManager } from "@/components/admin/GamificationManager";

const moduleSchema = z.object({
  title: z.string().trim().min(3, "O título deve ter pelo menos 3 caracteres").max(200),
  description: z.string().trim().min(10, "A descrição deve ter pelo menos 10 caracteres").max(1000),
  category: z.string().trim().min(2).max(100),
  estimated_hours: z.number().min(1).max(100),
  difficulty_level: z.string(),
});

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<any[]>([]);
  
  const [newModule, setNewModule] = useState({
    title: "",
    description: "",
    category: "",
    difficulty_level: "intermediate",
    estimated_hours: 5,
  });

  useEffect(() => {
    const checkAdminAccess = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Se não estiver logado, manda para /auth
      if (!session) {
        navigate("/auth");
        return;
      }

      // ====== ADMIN LOCAL POR E-MAIL ======
      const adminEmails = ["mathvalenca@gmail.com"]; // aqui você pode adicionar mais e-mails se quiser
      const userEmail = session.user.email ?? "";

      const isAdminUser = adminEmails.includes(userEmail);

      if (!isAdminUser) {
        toast.error("Admin access only");
        navigate("/dashboard");
        return;
      }

      // Se chegou até aqui, é admin
      setIsAdmin(true);
      await loadModules();
      setLoading(false);
    };

    checkAdminAccess();
  }, [navigate]);

  const loadModules = async () => {
    const { data } = await supabase
      .from("modules")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) {
      setModules(data);
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = moduleSchema.parse(newModule);
      
      console.log("Criando módulo com dados:", validated);
      
      const { data, error } = await supabase
        .from("modules")
        .insert({
          title: validated.title,
          description: validated.description,
          category: validated.category,
          difficulty_level: validated.difficulty_level,
          estimated_hours: validated.estimated_hours,
          order_index: modules.length,
          published: false,
        })
        .select();

      if (error) {
        console.error("Erro do Supabase:", error);
        throw error;
      }

      console.log("Módulo criado:", data);
      toast.success("Módulo criado com sucesso!");
      setNewModule({
        title: "",
        description: "",
        category: "",
        difficulty_level: "intermediate",
        estimated_hours: 5,
      });
      loadModules();
    } catch (error) {
      console.error("Erro ao criar módulo:", error);
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (error && typeof error === 'object' && 'message' in error) {
        toast.error(`Erro: ${(error as any).message}`);
      } else {
        toast.error("Falha ao criar módulo");
      }
    }
  };

  const toggleModulePublish = async (moduleId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("modules")
      .update({ published: !currentStatus })
      .eq("id", moduleId);

    if (error) {
      toast.error("Falha ao atualizar módulo");
    } else {
      toast.success(currentStatus ? "Módulo despublicado" : "Módulo publicado");
      loadModules();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="ProGenia" className="h-10" />
            <span className="text-sm font-medium text-muted-foreground">Painel de Administração</span>
          </div>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <Home className="mr-2 h-4 w-4" />
            Voltar ao Painel
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Painel de Administração</h1>
          <p className="text-muted-foreground text-lg">
            Gerencie o conteúdo da sua plataforma de aprendizado
          </p>
        </div>

        <Tabs defaultValue="modules" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9 max-w-6xl">
            <TabsTrigger value="modules">
              <BookOpen className="mr-2 h-4 w-4" />
              Módulos
            </TabsTrigger>
            <TabsTrigger value="lessons">
              <GraduationCap className="mr-2 h-4 w-4" />
              Aulas
            </TabsTrigger>
            <TabsTrigger value="labs">
              <Beaker className="mr-2 h-4 w-4" />
              Labs
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="mr-2 h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="gamification">
              <Award className="mr-2 h-4 w-4" />
              Gamificação
            </TabsTrigger>
            <TabsTrigger value="partners">
              <Handshake className="mr-2 h-4 w-4" />
              Parceiros
            </TabsTrigger>
            <TabsTrigger value="team">
              <UsersRound className="mr-2 h-4 w-4" />
              Equipe
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart className="mr-2 h-4 w-4" />
              Análises
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Config
            </TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="space-y-6">
            {/* Create Module Form */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Plus className="h-6 w-6" />
                Criar Novo Módulo
              </h2>
              
              <form onSubmit={handleCreateModule} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título do Módulo</Label>
                    <Input
                      id="title"
                      value={newModule.title}
                      onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                      placeholder="ex: Fundamentos de Eletroestimulação"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input
                      id="category"
                      value={newModule.category}
                      onChange={(e) => setNewModule({ ...newModule, category: e.target.value })}
                      placeholder="ex: Eletroterapia"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newModule.description}
                    onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                    placeholder="Descreva o que os alunos aprenderão..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Nível de Dificuldade</Label>
                    <Select
                      value={newModule.difficulty_level}
                      onValueChange={(value) => setNewModule({ ...newModule, difficulty_level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Iniciante</SelectItem>
                        <SelectItem value="intermediate">Intermediário</SelectItem>
                        <SelectItem value="advanced">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hours">Horas Estimadas</Label>
                    <Input
                      id="hours"
                      type="number"
                      min="1"
                      max="100"
                      value={newModule.estimated_hours}
                      onChange={(e) => setNewModule({ ...newModule, estimated_hours: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="gradient-accent text-white">
                  <Save className="mr-2 h-4 w-4" />
                  Criar Módulo
                </Button>
              </form>
            </Card>

            {/* Existing Modules */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Módulos Existentes ({modules.length})</h2>
              
              {modules.length === 0 ? (
                <Card className="p-12 text-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Nenhum Módulo Ainda</h3>
                  <p className="text-muted-foreground">
                    Crie seu primeiro módulo de aprendizado para começar
                  </p>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {modules.map((module) => (
                    <Card key={module.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{module.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              module.published 
                                ? "bg-secondary/10 text-secondary" 
                                : "bg-muted text-muted-foreground"
                            }`}>
                              {module.published ? "Publicado" : "Rascunho"}
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-2">{module.description}</p>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>📚 {module.category}</span>
                            <span>⏱️ {module.estimated_hours}h</span>
                            <span>📊 {module.difficulty_level}</span>
                          </div>
                        </div>
                        <Button
                          variant={module.published ? "outline" : "default"}
                          onClick={() => toggleModulePublish(module.id, module.published)}
                        >
                          {module.published ? "Despublicar" : "Publicar"}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="lessons">
            <LessonsManager />
          </TabsContent>

          <TabsContent value="labs">
            <Card className="p-12 text-center">
              <Beaker className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Laboratórios Virtuais</h3>
              <p className="text-muted-foreground mb-4">
                Configure laboratórios virtuais para suas aulas
              </p>
              <p className="text-sm text-muted-foreground">
                Para adicionar um laboratório, primeiro crie uma aula do tipo "Laboratório Virtual" na aba Aulas,
                depois configure os parâmetros específicos aqui.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="partners">
            <PartnersManager />
          </TabsContent>

          <TabsContent value="team">
            <TeamManager />
          </TabsContent>

          <TabsContent value="users">
            <UsersManager />
          </TabsContent>

          <TabsContent value="gamification">
            <GamificationManager />
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="p-12 text-center">
              <BarChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Análises da Plataforma</h3>
              <p className="text-muted-foreground">
                Painel de análises em breve
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-12 text-center">
              <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Configurações da Plataforma</h3>
              <p className="text-muted-foreground">
                Opções de configuração em breve
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
