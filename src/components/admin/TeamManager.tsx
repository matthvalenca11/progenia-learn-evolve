import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

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

  const handleSave = async () => {
    if (!editingMember.name || !editingMember.role) {
      toast.error("Nome e função são obrigatórios");
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
        toast.success("Membro atualizado!");
      } else {
        const { error } = await supabase.from("team_members").insert({
          name: editingMember.name,
          role: editingMember.role,
          bio: editingMember.bio,
          photo_url: editingMember.photo_url,
          ordem: team.length,
        });
        if (error) throw error;
        toast.success("Membro adicionado!");
      }

      setEditingMember({ name: "", role: "", bio: "", photo_url: "" });
      loadTeam();
    } catch (error) {
      toast.error("Erro ao salvar membro");
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
            <Label>URL da Foto</Label>
            <Input
              value={editingMember.photo_url || ""}
              onChange={(e) => setEditingMember({ ...editingMember, photo_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label>Mini Bio</Label>
            <Textarea
              value={editingMember.bio || ""}
              onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
              placeholder="Breve descrição do membro da equipe"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="gradient-accent text-white">
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
        <h3 className="text-xl font-semibold mb-4">
          Membros da Equipe ({team.length})
        </h3>

        {team.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum membro cadastrado ainda</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.map((member) => (
              <Card key={member.id} className="p-4">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center overflow-hidden">
                    {member.photo_url ? (
                      <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <h4 className="font-semibold">{member.name}</h4>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  {member.bio && (
                    <p className="text-xs text-muted-foreground mb-3">{member.bio}</p>
                  )}
                  <div className="flex gap-2 justify-center">
                    <Button size="sm" variant="outline" onClick={() => setEditingMember(member)}>
                      Editar
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(member.id)}>
                      <Trash2 className="h-3 w-3" />
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