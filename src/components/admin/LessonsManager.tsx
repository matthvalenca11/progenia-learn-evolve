import { useState, useEffect } from "react";
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
import { Plus, Save, Trash2, Video, FileText, HelpCircle, Beaker } from "lucide-react";
import { toast } from "sonner";

interface Module {
  id: string;
  title: string;
}

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  descricao_curta: string | null;
  content_type: string;
  content_url: string | null;
  video_url: string | null;
  content_data: any;
  recursos: any;
  published: boolean;
  order_index: number | null;
}

export const LessonsManager = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");
  const [editingLesson, setEditingLesson] = useState<Partial<Lesson>>({
    title: "",
    descricao_curta: "",
    content_type: "video",
    content_url: "",
    video_url: "",
    published: false,
  });

  useEffect(() => {
    loadModules();
  }, []);

  useEffect(() => {
    if (selectedModuleId) {
      loadLessons(selectedModuleId);
    }
  }, [selectedModuleId]);

  const loadModules = async () => {
    const { data } = await supabase
      .from("modules")
      .select("id, title")
      .order("order_index");
    if (data) setModules(data);
  };

  const loadLessons = async (moduleId: string) => {
    const { data } = await supabase
      .from("lessons")
      .select("*")
      .eq("module_id", moduleId)
      .order("order_index");
    if (data) setLessons(data);
  };

  const handleSaveLesson = async () => {
    if (!selectedModuleId) {
      toast.error("Selecione um módulo primeiro");
      return;
    }

    if (!editingLesson.title) {
      toast.error("Título é obrigatório");
      return;
    }

    try {
      if (editingLesson.id) {
        // Update
        const { error } = await supabase
          .from("lessons")
          .update({
            title: editingLesson.title,
            descricao_curta: editingLesson.descricao_curta,
            content_type: editingLesson.content_type,
            content_url: editingLesson.content_url,
            video_url: editingLesson.video_url,
            published: editingLesson.published,
          })
          .eq("id", editingLesson.id);

        if (error) throw error;
        toast.success("Aula atualizada com sucesso!");
      } else {
        // Create
        const { error } = await supabase.from("lessons").insert({
          module_id: selectedModuleId,
          title: editingLesson.title,
          descricao_curta: editingLesson.descricao_curta,
          content_type: editingLesson.content_type || "video",
          content_url: editingLesson.content_url,
          video_url: editingLesson.video_url,
          published: editingLesson.published || false,
          order_index: lessons.length,
        });

        if (error) throw error;
        toast.success("Aula criada com sucesso!");
      }

      setEditingLesson({
        title: "",
        descricao_curta: "",
        content_type: "video",
        content_url: "",
        video_url: "",
        published: false,
      });
      loadLessons(selectedModuleId);
    } catch (error) {
      toast.error("Erro ao salvar aula");
      console.error(error);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta aula?")) return;

    try {
      const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
      if (error) throw error;
      toast.success("Aula excluída");
      loadLessons(selectedModuleId);
    } catch (error) {
      toast.error("Erro ao excluir aula");
    }
  };

  const togglePublish = async (lesson: Lesson) => {
    try {
      const { error } = await supabase
        .from("lessons")
        .update({ published: !lesson.published })
        .eq("id", lesson.id);

      if (error) throw error;
      toast.success(lesson.published ? "Aula despublicada" : "Aula publicada");
      loadLessons(selectedModuleId);
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5" />;
      case "article":
        return <FileText className="h-5 w-5" />;
      case "quiz":
        return <HelpCircle className="h-5 w-5" />;
      case "virtual_lab":
        return <Beaker className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Selector */}
      <Card className="p-6">
        <Label htmlFor="module-select">Selecionar Módulo</Label>
        <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Escolha um módulo" />
          </SelectTrigger>
          <SelectContent>
            {modules.map((module) => (
              <SelectItem key={module.id} value={module.id}>
                {module.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {selectedModuleId && (
        <>
          {/* Create/Edit Lesson Form */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {editingLesson.id ? "Editar Aula" : "Criar Nova Aula"}
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="lesson-title">Título da Aula</Label>
                <Input
                  id="lesson-title"
                  value={editingLesson.title}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, title: e.target.value })
                  }
                  placeholder="ex: Princípios da Eletroestimulação"
                />
              </div>

              <div>
                <Label htmlFor="lesson-desc">Descrição Curta</Label>
                <Textarea
                  id="lesson-desc"
                  value={editingLesson.descricao_curta || ""}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, descricao_curta: e.target.value })
                  }
                  placeholder="Breve descrição do conteúdo da aula"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="lesson-type">Tipo de Conteúdo</Label>
                <Select
                  value={editingLesson.content_type}
                  onValueChange={(value) =>
                    setEditingLesson({ ...editingLesson, content_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Vídeo</SelectItem>
                    <SelectItem value="article">Artigo/Texto</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="virtual_lab">Laboratório Virtual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="video-url">URL do Vídeo (opcional)</Label>
                <Input
                  id="video-url"
                  value={editingLesson.video_url || ""}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, video_url: e.target.value })
                  }
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div>
                <Label htmlFor="content-url">URL do Conteúdo (opcional)</Label>
                <Input
                  id="content-url"
                  value={editingLesson.content_url || ""}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, content_url: e.target.value })
                  }
                  placeholder="Link para PDF, artigo, etc."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={editingLesson.published || false}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, published: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor="published" className="cursor-pointer">
                  Publicar aula imediatamente
                </Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveLesson} className="gradient-accent text-white">
                  <Save className="mr-2 h-4 w-4" />
                  {editingLesson.id ? "Atualizar" : "Criar"} Aula
                </Button>
                {editingLesson.id && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      setEditingLesson({
                        title: "",
                        descricao_curta: "",
                        content_type: "video",
                        content_url: "",
                        video_url: "",
                        published: false,
                      })
                    }
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Existing Lessons */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Aulas Existentes ({lessons.length})
            </h3>

            {lessons.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  Nenhuma aula criada ainda para este módulo
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {lessons.map((lesson) => (
                  <Card key={lesson.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {getContentIcon(lesson.content_type)}
                        <div>
                          <h4 className="font-semibold">{lesson.title}</h4>
                          {lesson.descricao_curta && (
                            <p className="text-sm text-muted-foreground">
                              {lesson.descricao_curta}
                            </p>
                          )}
                          <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                            <span>Tipo: {lesson.content_type}</span>
                            <span
                              className={
                                lesson.published ? "text-secondary" : "text-muted-foreground"
                              }
                            >
                              {lesson.published ? "Publicada" : "Rascunho"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingLesson(lesson)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant={lesson.published ? "outline" : "default"}
                          onClick={() => togglePublish(lesson)}
                        >
                          {lesson.published ? "Despublicar" : "Publicar"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteLesson(lesson.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
