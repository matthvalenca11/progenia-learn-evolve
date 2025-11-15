import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, Trash2, Handshake, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  website_url: string | null;
  ordem: number;
}

export const PartnersManager = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [editingPartner, setEditingPartner] = useState<Partial<Partner>>({
    name: "",
    logo_url: "",
    description: "",
    website_url: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    const { data } = await supabase
      .from("partners")
      .select("*")
      .order("ordem");
    if (data) setPartners(data);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Por favor, selecione uma imagem");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 2MB");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('partner-logos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('partner-logos')
        .getPublicUrl(filePath);

      setEditingPartner({ ...editingPartner, logo_url: publicUrl });
      toast.success("Logo enviado com sucesso!");
    } catch (error) {
      console.error("Erro no upload:", error);
      toast.error("Erro ao enviar logo");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!editingPartner.name) {
      toast.error("Nome é obrigatório");
      return;
    }

    try {
      if (editingPartner.id) {
        const { error } = await supabase
          .from("partners")
          .update({
            name: editingPartner.name,
            logo_url: editingPartner.logo_url,
            description: editingPartner.description,
            website_url: editingPartner.website_url,
          })
          .eq("id", editingPartner.id);
        if (error) throw error;
        toast.success("Parceiro atualizado!");
      } else {
        const { error } = await supabase.from("partners").insert({
          name: editingPartner.name,
          logo_url: editingPartner.logo_url,
          description: editingPartner.description,
          website_url: editingPartner.website_url,
          ordem: partners.length,
        });
        if (error) throw error;
        toast.success("Parceiro adicionado!");
      }

      setEditingPartner({ name: "", logo_url: "", description: "", website_url: "" });
      loadPartners();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar parceiro");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este parceiro?")) return;
    
    try {
      const { error } = await supabase.from("partners").delete().eq("id", id);
      if (error) throw error;
      toast.success("Parceiro excluído");
      loadPartners();
    } catch (error) {
      toast.error("Erro ao excluir parceiro");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          {editingPartner.id ? "Editar Parceiro" : "Adicionar Parceiro"}
        </h3>

        <div className="space-y-4">
          <div>
            <Label>Nome do Parceiro</Label>
            <Input
              value={editingPartner.name}
              onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
              placeholder="ex: Universidade Federal"
            />
          </div>

          <div>
            <Label>Logo do Parceiro</Label>
            <div className="space-y-2">
              {editingPartner.logo_url && (
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
                  <img 
                    src={editingPartner.logo_url} 
                    alt="Preview" 
                    className="h-16 w-16 object-contain bg-background rounded"
                  />
                  <div className="flex-1 text-sm text-muted-foreground truncate">
                    {editingPartner.logo_url}
                  </div>
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById('partner-logo-upload')?.click()}
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
                    Fazer Upload da Imagem
                  </>
                )}
              </Button>
              <input
                id="partner-logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <p className="text-xs text-muted-foreground">
                Formatos aceitos: JPG, PNG, SVG (máximo 2MB)
              </p>
            </div>
          </div>

          <div>
            <Label>Descrição</Label>
            <Textarea
              value={editingPartner.description || ""}
              onChange={(e) => setEditingPartner({ ...editingPartner, description: e.target.value })}
              placeholder="Breve descrição do parceiro"
              rows={3}
            />
          </div>

          <div>
            <Label>Site do Parceiro</Label>
            <Input
              value={editingPartner.website_url || ""}
              onChange={(e) => setEditingPartner({ ...editingPartner, website_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              {editingPartner.id ? "Atualizar" : "Adicionar"}
            </Button>
            {editingPartner.id && (
              <Button
                variant="outline"
                onClick={() => setEditingPartner({ name: "", logo_url: "", description: "", website_url: "" })}
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div>
        <h3 className="text-xl font-semibold mb-4">Parceiros Cadastrados ({partners.length})</h3>
        {partners.length === 0 ? (
          <Card className="p-12 text-center">
            <Handshake className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum Parceiro Ainda</h3>
            <p className="text-muted-foreground">
              Adicione parceiros e apoiadores da plataforma
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {partners.map((partner) => (
              <Card key={partner.id} className="p-4">
                <div className="flex items-center gap-4">
                  {partner.logo_url ? (
                    <img 
                      src={partner.logo_url} 
                      alt={partner.name}
                      className="h-16 w-16 object-contain bg-muted rounded"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-muted rounded flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold">{partner.name}</h4>
                    {partner.description && (
                      <p className="text-sm text-muted-foreground">{partner.description}</p>
                    )}
                    {partner.website_url && (
                      <a 
                        href={partner.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-secondary hover:underline"
                      >
                        {partner.website_url}
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingPartner(partner)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(partner.id)}
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