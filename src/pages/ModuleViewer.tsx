import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  Video, 
  FileText, 
  ClipboardCheck,
  FlaskConical,
  Lock,
  CheckCircle2,
  PlayCircle
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

interface Lesson {
  id: string;
  title: string;
  content_type: string;
  descricao_curta: string | null;
  duration_minutes: number | null;
  order_index: number | null;
  published: boolean;
}

interface LessonWithProgress extends Lesson {
  progress?: {
    status: string;
    data_conclusao: string | null;
  };
  isUnlocked: boolean;
}

export default function ModuleViewer() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [module, setModule] = useState<any>(null);
  const [lessons, setLessons] = useState<LessonWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (moduleId) {
      loadModuleAndLessons();
    }
  }, [moduleId, user, navigate]);

  const loadModuleAndLessons = async () => {
    try {
      // Carregar módulo
      const { data: moduleData, error: moduleError } = await supabase
        .from("modules")
        .select("*")
        .eq("id", moduleId)
        .single();

      if (moduleError) throw moduleError;
      setModule(moduleData);

      // Carregar aulas do módulo
      const { data: lessonsData, error: lessonsError } = await supabase
        .from("lessons")
        .select("*")
        .eq("module_id", moduleId)
        .eq("published", true)
        .order("order_index", { ascending: true });

      if (lessonsError) throw lessonsError;

      // Carregar progresso do usuário
      const { data: progressData } = await supabase
        .from("lesson_progress")
        .select("lesson_id, status, data_conclusao")
        .eq("user_id", user!.id)
        .in("lesson_id", lessonsData.map(l => l.id));

      // Mapear progresso para as aulas
      const progressMap = new Map(
        progressData?.map(p => [p.lesson_id, p]) || []
      );

      // Determinar quais aulas estão desbloqueadas
      const lessonsWithProgress: LessonWithProgress[] = lessonsData.map((lesson, index) => {
        const progress = progressMap.get(lesson.id);
        const isCompleted = progress?.status === "concluido";
        
        // Primeira aula sempre desbloqueada
        // Aulas seguintes só se a anterior foi concluída
        let isUnlocked = index === 0;
        if (index > 0) {
          const previousLesson = lessonsData[index - 1];
          const previousProgress = progressMap.get(previousLesson.id);
          isUnlocked = previousProgress?.status === "concluido";
        }

        return {
          ...lesson,
          progress,
          isUnlocked,
        };
      });

      setLessons(lessonsWithProgress);
    } catch (error: any) {
      console.error("Erro ao carregar módulo:", error);
      toast.error("Erro ao carregar módulo", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = (lesson: LessonWithProgress) => {
    if (!lesson.isUnlocked) {
      toast.error("Aula bloqueada", {
        description: "Complete a aula anterior para desbloquear esta",
      });
      return;
    }

    navigate(`/lesson/${lesson.id}`);
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5" />;
      case "artigo":
        return <FileText className="h-5 w-5" />;
      case "quiz":
        return <ClipboardCheck className="h-5 w-5" />;
      case "laboratorio_virtual":
        return <FlaskConical className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case "video":
        return "Vídeo";
      case "artigo":
        return "Artigo";
      case "quiz":
        return "Quiz";
      case "laboratorio_virtual":
        return "Lab Virtual";
      default:
        return type;
    }
  };

  const calculateProgress = () => {
    if (lessons.length === 0) return 0;
    const completed = lessons.filter(l => l.progress?.status === "concluido").length;
    return (completed / lessons.length) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando módulo...</p>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Módulo não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="ProGenia" className="h-10" />
          </div>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </div>
      </nav>

      {/* Module Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Badge variant="secondary" className="mb-2">
                    {module.category}
                  </Badge>
                  <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
                  <p className="text-muted-foreground">{module.description}</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span>Progresso do módulo</span>
                  <span>{Math.round(calculateProgress())}%</span>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
              </div>

              <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                <span>{lessons.length} aulas</span>
                <span>•</span>
                <span>{module.estimated_hours}h estimadas</span>
                <span>•</span>
                <span>
                  {lessons.filter(l => l.progress?.status === "concluido").length} concluídas
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Lessons List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Aulas do Módulo</h2>
            
            {lessons.map((lesson, index) => {
              const isCompleted = lesson.progress?.status === "concluido";
              const isInProgress = lesson.progress?.status === "em_progresso";

              return (
                <Card
                  key={lesson.id}
                  className={`transition-all ${
                    lesson.isUnlocked
                      ? "hover:shadow-lg cursor-pointer"
                      : "opacity-60 cursor-not-allowed"
                  }`}
                  onClick={() => handleLessonClick(lesson)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Number/Status Icon */}
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          </div>
                        ) : !lesson.isUnlocked ? (
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <Lock className="h-5 w-5 text-muted-foreground" />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-semibold">
                              {index + 1}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getContentTypeIcon(lesson.content_type)}
                            {getContentTypeLabel(lesson.content_type)}
                          </Badge>
                          {lesson.duration_minutes && (
                            <span className="text-xs text-muted-foreground">
                              {lesson.duration_minutes} min
                            </span>
                          )}
                        </div>

                        <h3 className="font-semibold mb-1">{lesson.title}</h3>
                        
                        {lesson.descricao_curta && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {lesson.descricao_curta}
                          </p>
                        )}

                        {isInProgress && !isCompleted && (
                          <Badge variant="secondary" className="mt-2">
                            Em progresso
                          </Badge>
                        )}
                      </div>

                      {/* Action Button */}
                      {lesson.isUnlocked && (
                        <Button variant="ghost" size="icon">
                          <PlayCircle className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
