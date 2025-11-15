import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { lessonService } from "@/services/lessonService";
import { progressService } from "@/services/progressService";
import { storageService } from "@/services/storageService";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronLeft, 
  FileText, 
  Video, 
  CheckCircle2, 
  Download,
  ExternalLink 
} from "lucide-react";
import { MRIViewer } from "@/components/labs/MRIViewer";
import { UltrasoundSimulator } from "@/components/labs/UltrasoundSimulator";
import { EletroterapiaLab } from "@/components/labs/EletroterapiaLab";
import { ThermalLab } from "@/components/labs/ThermalLab";
import { toast } from "@/hooks/use-toast";

export default function LessonViewer() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [lesson, setLesson] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [lab, setLab] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (lessonId && user) {
      loadLesson();
      loadProgress();
    }
  }, [lessonId, user, authLoading, navigate]);

  const loadLesson = async () => {
    try {
      const data = await lessonService.getLessonById(lessonId!);
      setLesson(data);

      // Se tem vídeo no storage, gerar URL assinada
      if (data.video_storage_path) {
        const url = await storageService.getSignedUrl(
          "lesson-videos",
          data.video_storage_path,
          3600
        );
        setVideoUrl(url);
      }

      // Se é laboratório virtual, carregar config
      if (data.content_type === "laboratorio_virtual") {
        const labData = await lessonService.getVirtualLab(lessonId!);
        setLab(labData);
      }
    } catch (error: any) {
      console.error("Erro ao carregar aula:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar a aula",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const data = await progressService.getLessonProgress(user!.id, lessonId!);
      setProgress(data);

      // Se não iniciou ainda, marcar como iniciada
      if (!data) {
        await progressService.startLesson(user!.id, lessonId!);
        loadProgress();
      }
    } catch (error) {
      console.error("Erro ao carregar progresso:", error);
    }
  };

  const handleComplete = async () => {
    if (!user || !lessonId) return;

    try {
      await progressService.completeLesson(user.id, lessonId);
      toast({
        title: "Aula concluída!",
        description: "Você ganhou pontos por completar esta aula",
      });
      loadProgress();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível concluir a aula",
      });
    }
  };

  const downloadAsset = async (asset: any) => {
    try {
      const url = await storageService.getSignedUrl(
        "lesson-assets",
        asset.path,
        300
      );
      window.open(url, "_blank");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível baixar o arquivo",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Carregando aula...</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Aula não encontrada</div>
      </div>
    );
  }

  const isCompleted = progress?.status === "concluido";
  const assets = lesson.assets || [];

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/module/${lesson.module_id}`)}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar ao Módulo
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>{lesson.modules?.title}</span>
          </div>
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
        </div>
        {isCompleted && (
          <Badge variant="default" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Concluída
          </Badge>
        )}
      </div>

      {/* Conteúdo Principal */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Vídeo */}
          {lesson.content_type === "video" && (
            <Card>
              <CardContent className="p-0">
                {videoUrl ? (
                  <video
                    controls
                    className="w-full rounded-lg"
                    src={videoUrl}
                  >
                    Seu navegador não suporta vídeo HTML5.
                  </video>
                ) : lesson.video_external_url ? (
                  <div className="aspect-video">
                    <iframe
                      src={lesson.video_external_url}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="aspect-video flex items-center justify-center bg-muted rounded-lg">
                    <p className="text-muted-foreground">Vídeo não disponível</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Artigo */}
          {lesson.content_type === "artigo" && lesson.conteudo_rich_text && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Conteúdo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: lesson.conteudo_rich_text }}
                />
              </CardContent>
            </Card>
          )}

          {/* Laboratório Virtual */}
          {lesson.content_type === "laboratorio_virtual" && lab && (
            <>
              {lab.lab_type === "mri_viewer" && (
                <MRIViewer config={lab.config_data} />
              )}
              {lab.lab_type === "ultrassom_simulador" && (
                <UltrasoundSimulator config={lab.config_data} />
              )}
              {lab.lab_type === "eletroterapia_sim" && (
                <EletroterapiaLab config={lab.config_data} />
              )}
              {lab.lab_type === "termico_sim" && (
                <ThermalLab config={lab.config_data} />
              )}
            </>
          )}

          {/* Descrição */}
          {lesson.descricao_curta && (
            <Card>
              <CardHeader>
                <CardTitle>Sobre esta aula</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{lesson.descricao_curta}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ação de Conclusão */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              {!isCompleted ? (
                <Button
                  onClick={handleComplete}
                  className="w-full"
                  size="lg"
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Marcar como concluída
                </Button>
              ) : (
                <div className="text-center py-4">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-2" />
                  <p className="font-medium">Aula concluída!</p>
                  <p className="text-sm text-muted-foreground">
                    Continue aprendendo
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Materiais Complementares */}
          {assets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Materiais Complementares</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {assets.map((asset: any, index: number) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => downloadAsset(asset)}
                  >
                    <span className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      {asset.name || `Material ${index + 1}`}
                    </span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Info da Aula */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo:</span>
                <Badge variant="secondary">
                  {lesson.content_type === "video" && "Vídeo"}
                  {lesson.content_type === "artigo" && "Artigo"}
                  {lesson.content_type === "quiz" && "Quiz"}
                  {lesson.content_type === "laboratorio_virtual" && "Lab Virtual"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
