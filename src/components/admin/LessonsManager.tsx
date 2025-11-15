import { useState, useEffect } from "react";
import { moduleService } from "@/services/moduleService";
import { lessonService } from "@/services/lessonService";
import { storageService } from "@/services/storageService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUploadField } from "@/components/ui/FileUploadField";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { 
  GraduationCap, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Video, 
  FileText,
  FlaskConical,
  ClipboardCheck,
  Eye,
  EyeOff
} from "lucide-react";

export function LessonsManager() {
  const [modules, setModules] = useState<any[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");
  const [lessons, setLessons] = useState<any[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content_type: "video",
    descricao_curta: "",
    duration_minutes: 0,
    video_external_url: "",
    conteudo_rich_text: "",
    published: false,
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [assetFiles, setAssetFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadModules();
  }, []);

  useEffect(() => {
    if (selectedModuleId) {
      loadLessons();
    }
  }, [selectedModuleId]);

  const loadModules = async () => {
    try {
      const data = await moduleService.getAllModules();
      setModules(data);
      if (data.length > 0 && !selectedModuleId) {
        setSelectedModuleId(data[0].id);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      });
    }
  };

  const loadLessons = async () => {
    try {
      const data = await lessonService.getAllLessonsByModule(selectedModuleId);
      setLessons(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      });
    }
  };

  const startEdit = (lesson?: any) => {
    if (lesson) {
      setEditing(lesson.id);
      setFormData({
        title: lesson.title,
        content_type: lesson.content_type,
        descricao_curta: lesson.descricao_curta || "",
        duration_minutes: lesson.duration_minutes || 0,
        video_external_url: lesson.video_external_url || "",
        conteudo_rich_text: lesson.conteudo_rich_text || "",
        published: lesson.published || false,
      });
    } else {
      setEditing("new");
      setFormData({
        title: "",
        content_type: "video",
        descricao_curta: "",
        duration_minutes: 0,
        video_external_url: "",
        conteudo_rich_text: "",
        published: false,
      });
    }
    setVideoFile(null);
    setAssetFiles([]);
  };

  const cancelEdit = () => {
    setEditing(null);
    setFormData({
      title: "",
      content_type: "video",
      descricao_curta: "",
      duration_minutes: 0,
      video_external_url: "",
      conteudo_rich_text: "",
      published: false,
    });
    setVideoFile(null);
    setAssetFiles([]);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Título é obrigatório",
      });
      return;
    }

    if (!selectedModuleId) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione um módulo",
      });
      return;
    }

    setUploading(true);
    try {
      // Preparar dados básicos da aula
      const lessonData: any = {
        module_id: selectedModuleId,
        title: formData.title.trim(),
        content_type: formData.content_type,
        descricao_curta: formData.descricao_curta.trim() || null,
        duration_minutes: formData.duration_minutes || null,
        published: formData.published,
      };

      if (formData.content_type === "video") {
        lessonData.video_external_url = formData.video_external_url.trim() || null;
      }

      if (formData.content_type === "artigo") {
        lessonData.conteudo_rich_text = formData.conteudo_rich_text;
      }

      // Se for nova aula, criar primeiro para obter o ID
      let lessonId = editing;
      if (editing === "new") {
        const newLesson = await lessonService.createLesson(lessonData);
        lessonId = newLesson.id;
      }

      // Agora fazer upload dos arquivos usando o ID real da aula
      let videoStoragePath = null;
      let assetsData: any[] = [];

      if (videoFile) {
        const fileName = storageService.generateUniqueFileName(videoFile.name);
        const path = `${selectedModuleId}/${lessonId}/${fileName}`;
        const result = await storageService.uploadFile({
          bucket: "lesson-videos",
          path,
          file: videoFile,
        });
        videoStoragePath = result.path;
      }

      if (assetFiles.length > 0) {
        const uploads = await Promise.all(
          assetFiles.map(async (file) => {
            const fileName = storageService.generateUniqueFileName(file.name);
            const path = `${selectedModuleId}/${lessonId}/${fileName}`;
            const result = await storageService.uploadFile({
              bucket: "lesson-assets",
              path,
              file,
            });
            return {
              name: file.name,
              path: result.path,
              type: file.type,
            };
          })
        );
        assetsData = uploads;
      }

      // Atualizar aula com os paths dos arquivos
      if (videoStoragePath || assetsData.length > 0) {
        const updateData: any = {};
        if (videoStoragePath) {
          updateData.video_storage_path = videoStoragePath;
        }
        if (assetsData.length > 0) {
          updateData.assets = assetsData;
        }
        await lessonService.updateLesson(lessonId, updateData);
      }

      if (editing === "new") {
        toast({
          title: "Aula criada",
          description: "A aula foi criada com sucesso",
        });
      } else {
        await lessonService.updateLesson(editing, lessonData);
        toast({
          title: "Aula atualizada",
          description: "As alterações foram salvas com sucesso",
        });
      }

      loadLessons();
      cancelEdit();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${title}"?`)) return;

    try {
      await lessonService.deleteLesson(id);
      toast({
        title: "Aula excluída",
        description: "A aula foi removida com sucesso",
      });
      loadLessons();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      });
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await lessonService.togglePublish(id, !currentStatus);
      toast({
        title: currentStatus ? "Aula despublicada" : "Aula publicada",
        description: currentStatus 
          ? "A aula não está mais visível para os alunos"
          : "A aula está agora visível para os alunos",
      });
      loadLessons();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      });
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "artigo":
        return <FileText className="h-4 w-4" />;
      case "quiz":
        return <ClipboardCheck className="h-4 w-4" />;
      case "laboratorio_virtual":
        return <FlaskConical className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getContentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      video: "Vídeo",
      artigo: "Artigo",
      quiz: "Quiz",
      laboratorio_virtual: "Lab Virtual",
    };
    return labels[type] || type;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Gerenciar Aulas
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Selecione um módulo" />
              </SelectTrigger>
              <SelectContent>
                {modules.map((module) => (
                  <SelectItem key={module.id} value={module.id}>
                    {module.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => startEdit()} size="sm" disabled={!selectedModuleId} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Nova Aula
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {editing && (
          <Card className="border-primary">
            <CardContent className="pt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Nome da aula"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Conteúdo *</Label>
                  <Select 
                    value={formData.content_type} 
                    onValueChange={(v) => setFormData({ ...formData, content_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Vídeo</SelectItem>
                      <SelectItem value="artigo">Artigo</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="laboratorio_virtual">Laboratório Virtual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descrição Curta</Label>
                <Textarea
                  value={formData.descricao_curta}
                  onChange={(e) => setFormData({ ...formData, descricao_curta: e.target.value })}
                  placeholder="Breve descrição do conteúdo"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Duração (minutos)</Label>
                <Input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                  min={0}
                />
              </div>

              {formData.content_type === "video" && (
                <>
                  <div className="space-y-2">
                    <Label>Upload de Vídeo</Label>
                    <FileUploadField
                      accept="video/*"
                      onFilesSelected={(files) => setVideoFile(files[0])}
                      label="Selecione o vídeo da aula"
                      description="Formatos: MP4, WEBM"
                      maxSize={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>OU URL Externa (YouTube, Vimeo, etc.)</Label>
                    <Input
                      value={formData.video_external_url}
                      onChange={(e) => setFormData({ ...formData, video_external_url: e.target.value })}
                      placeholder="https://..."
                      type="url"
                    />
                  </div>
                </>
              )}

              {formData.content_type === "artigo" && (
                <div className="space-y-2">
                  <Label>Conteúdo do Artigo</Label>
                  <Textarea
                    value={formData.conteudo_rich_text}
                    onChange={(e) => setFormData({ ...formData, conteudo_rich_text: e.target.value })}
                    placeholder="Conteúdo em HTML ou texto"
                    rows={10}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Materiais Complementares</Label>
                <FileUploadField
                  multiple
                  onFilesSelected={setAssetFiles}
                  label="PDFs, imagens, slides, etc."
                  description="Múltiplos arquivos permitidos"
                  maxSize={50}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label>Publicar aula</Label>
                  <p className="text-sm text-muted-foreground">
                    Tornar visível para os alunos
                  </p>
                </div>
                <Switch
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={uploading} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {uploading ? "Salvando..." : "Salvar"}
                </Button>
                <Button onClick={cancelEdit} variant="outline" disabled={uploading}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!selectedModuleId ? (
          <div className="text-center py-8 text-muted-foreground">
            Selecione um módulo para gerenciar suas aulas
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma aula cadastrada neste módulo ainda
          </div>
        ) : (
          <div className="space-y-2">
            {lessons.map((lesson, index) => (
              <Card key={lesson.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        <Badge variant="outline" className="gap-1">
                          {getContentTypeIcon(lesson.content_type)}
                          {getContentTypeLabel(lesson.content_type)}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-muted-foreground">#{index + 1}</span>
                          <h4 className="font-medium">{lesson.title}</h4>
                          {lesson.published ? (
                            <Eye className="h-4 w-4 text-green-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        {lesson.descricao_curta && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {lesson.descricao_curta}
                          </p>
                        )}
                        {lesson.duration_minutes && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {lesson.duration_minutes} minutos
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublish(lesson.id, lesson.published)}
                        title={lesson.published ? "Despublicar" : "Publicar"}
                      >
                        {lesson.published ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(lesson)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(lesson.id, lesson.title)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
