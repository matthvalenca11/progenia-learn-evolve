import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadField } from "@/components/ui/FileUploadField";
import { storageService } from "@/services/storageService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Save, Trash2, Users, Edit2, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
  ordem: number;
}

export const TeamManager = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember>>({
    name: "",
    role: "",
    bio: "",
    photo_url: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    const { data } = await supabase
      .from("team_members")
      .select("*")
      .order("ordem");
    if (data) setTeam(data);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, selecione uma imagem",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "A imagem deve ter no máximo 2MB",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('team-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('team-photos')
        .getPublicUrl(filePath);

      setEditingMember({ ...editingMember, photo_url: publicUrl });
      toast({
        title: "Sucesso",
        description: "Foto enviada com sucesso!",
      });
    } catch (error) {
      console.error("Erro no upload:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao enviar foto",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!editingMember.name || !editingMember.role) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Nome e função são obrigatórios",
      });
      return;
    }

    try {
      if (editingMember.id) {
        const { error } = await supabase
          .from("team_members")
          .update({
            name: editingMember.name,
            role: editingMember.role,
            bio: editingMember.bio,
            photo_url: editingMember.photo_url,
          })
          .eq("id", editingMember.id);
        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Membro atualizado!",
        });
      } else {
        const { error } = await supabase.from("team_members").insert({
          name: editingMember.name,
          role: editingMember.role,
          bio: editingMember.bio,
          photo_url: editingMember.photo_url,
          ordem: team.length,
        });
        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Membro adicionado!",
        });
      }

      setEditingMember({ name: "", role: "", bio: "", photo_url: "" });
      loadTeam();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao salvar membro",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este membro?")) return;
    
    try {
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (error) throw error;
      toast.success("Membro excluído");
      loadTeam();
    } catch (error) {
      toast.error("Erro ao excluir membro");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          {editingMember.id ? "Editar Membro" : "Adicionar Membro da Equipe"}
        </h3>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Nome Completo</Label>
              <Input
                value={editingMember.name}
                onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                placeholder="ex: Dr. João Silva"
              />
            </div>

            <div>
              <Label>Função</Label>
              <Input
                value={editingMember.role}
                onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                placeholder="ex: Físico Médico"
              />
            </div>
          </div>

          <div>
            <Label>Foto do Membro</Label>
            <div className="space-y-2">
              {editingMember.photo_url && (
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
                  <img 
                    src={editingMember.photo_url} 
                    alt="Preview" 
                    className="h-20 w-20 object-cover rounded-full"
                  />
                  <div className="flex-1 text-sm text-muted-foreground truncate">
                    {editingMember.photo_url}
                  </div>
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById('team-photo-upload')?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Fazer Upload da Foto
                  </>
                )}
              </Button>
              <input
                id="team-photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <p className="text-xs text-muted-foreground">
                Formatos aceitos: JPG, PNG (máximo 2MB)
              </p>
            </div>
          </div>

          <div>
            <Label>Biografia</Label>
            <Textarea
              value={editingMember.bio || ""}
              onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
              placeholder="Breve descrição profissional"
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              {editingMember.id ? "Atualizar" : "Adicionar"}
            </Button>
            {editingMember.id && (
              <Button
                variant="outline"
                onClick={() => setEditingMember({ name: "", role: "", bio: "", photo_url: "" })}
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div>
        <h3 className="text-xl font-semibold mb-4">Equipe Cadastrada ({team.length})</h3>
        {team.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum Membro Ainda</h3>
            <p className="text-muted-foreground">
              Adicione membros da equipe ProGenia
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {team.map((member) => (
              <Card key={member.id} className="p-4">
                <div className="flex items-center gap-4">
                  {member.photo_url ? (
                    <img 
                      src={member.photo_url} 
                      alt={member.name}
                      className="h-20 w-20 object-cover rounded-full"
                    />
                  ) : (
                    <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center">
                      <UserCircle className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold">{member.name}</h4>
                    <p className="text-sm text-secondary">{member.role}</p>
                    {member.bio && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{member.bio}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingMember(member)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(member.id)}
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
    </div>
  );
};