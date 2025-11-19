import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { virtualLabService, VirtualLab, VirtualLabType, UltrasoundLabConfig } from "@/services/virtualLabService";
import { getAllPresets } from "@/config/ultrasoundPresets";
import { UltrasoundSimulatorAdvanced } from "@/components/labs/UltrasoundSimulatorAdvanced";

export default function VirtualLabEditor() {
  const navigate = useNavigate();
  const { labId } = useParams();
  const isEdit = !!labId;

  const [loading, setLoading] = useState(false);
  const [lab, setLab] = useState<VirtualLab>({
    name: "",
    description: "",
    lab_type: "ultrasound",
    config_data: {
      ultrasoundConfig: {
        presetId: "generic_muscle",
        controls: {
          showGain: true,
          showDepth: true,
          showFrequency: true,
          showFocus: true,
        },
      },
    },
  });

  const allPresets = getAllPresets();

  useEffect(() => {
    if (isEdit && labId) {
      loadLab();
    }
  }, [labId]);

  const loadLab = async () => {
    try {
      setLoading(true);
      const data = await virtualLabService.getLabById(labId!);
      if (data) {
        setLab(data);
      }
    } catch (error: any) {
      toast.error("Erro ao carregar laboratório", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!lab.name) {
      toast.error("O nome é obrigatório");
      return;
    }

    try {
      setLoading(true);
      if (isEdit && labId) {
        await virtualLabService.updateLab(labId, lab);
        toast.success("Laboratório atualizado com sucesso!");
      } else {
        await virtualLabService.createLab(lab);
        toast.success("Laboratório criado com sucesso!");
      }
      navigate("/admin/labs");
    } catch (error: any) {
      toast.error("Erro ao salvar laboratório", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const ultrasoundConfig = lab.config_data.ultrasoundConfig;
  const currentPreset = ultrasoundConfig ? allPresets.find(p => p.id === ultrasoundConfig.presetId) : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate("/admin/labs")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEdit ? "Editar Laboratório Virtual" : "Novo Laboratório Virtual"}
          </h1>
          <p className="text-muted-foreground">
            Configure um laboratório virtual reutilizável para anexar a múltiplas cápsulas
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Nome e descrição do laboratório</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Laboratório *</Label>
                <Input
                  id="name"
                  value={lab.name}
                  onChange={(e) => setLab({ ...lab, name: e.target.value })}
                  placeholder="Ex: US – Supraespinal Longitudinal"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={lab.description}
                  onChange={(e) => setLab({ ...lab, description: e.target.value })}
                  placeholder="Descrição breve do laboratório"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="labType">Tipo de Laboratório</Label>
                <Select
                  value={lab.lab_type}
                  onValueChange={(value: VirtualLabType) => setLab({ ...lab, lab_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ultrasound">Ultrassom</SelectItem>
                    <SelectItem value="electrotherapy">Eletroterapia</SelectItem>
                    <SelectItem value="thermal">Terapias Térmicas</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Ultrasound Configuration */}
          {lab.lab_type === "ultrasound" && ultrasoundConfig && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Preset de Anatomia</CardTitle>
                  <CardDescription>Escolha uma vista anatômica pré-configurada</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Preset Anatômico</Label>
                    <Select
                      value={ultrasoundConfig.presetId}
                      onValueChange={(value) =>
                        setLab({
                          ...lab,
                          config_data: {
                            ...lab.config_data,
                            ultrasoundConfig: {
                              ...ultrasoundConfig,
                              presetId: value as any,
                            },
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {allPresets.map((preset) => (
                          <SelectItem key={preset.id} value={preset.id}>
                            {preset.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {currentPreset && (
                      <div className="mt-2 p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium">{currentPreset.clinicalTagline}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {currentPreset.shortDescription}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Controles Disponíveis</CardTitle>
                  <CardDescription>Escolha quais parâmetros o aluno pode ajustar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: "showGain", label: "Controle de Ganho / Brilho" },
                    { key: "showDepth", label: "Controle de Profundidade" },
                    { key: "showFrequency", label: "Controle de Frequência (MHz)" },
                    { key: "showFocus", label: "Ajuste de Foco" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={key}>{label}</Label>
                      <Switch
                        id={key}
                        checked={ultrasoundConfig.controls[key as keyof typeof ultrasoundConfig.controls]}
                        onCheckedChange={(checked) =>
                          setLab({
                            ...lab,
                            config_data: {
                              ...lab.config_data,
                              ultrasoundConfig: {
                                ...ultrasoundConfig,
                                controls: {
                                  ...ultrasoundConfig.controls,
                                  [key]: checked,
                                },
                              },
                            },
                          })
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Live Preview Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Visualização ao Vivo</CardTitle>
              <CardDescription>
                Pré-visualização do laboratório com as configurações atuais
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lab.lab_type === "ultrasound" && ultrasoundConfig && currentPreset ? (
                <UltrasoundSimulatorAdvanced
                  config={{
                    enabled: true,
                    ...ultrasoundConfig.controls,
                    showTGC: false,
                    showDynamicRange: false,
                    showTransducerSelector: false,
                    showModeSelector: false,
                    showCompoundToggle: false,
                    showHarmonicToggle: false,
                    showZoom: false,
                    presetAnatomy: currentPreset.tissueProfile as any,
                    initialGain: currentPreset.recommendedGain,
                    initialDepth: currentPreset.recommendedDepthCm,
                    initialFrequency: currentPreset.recommendedFrequencyMHz,
                    initialTransducer: currentPreset.transducerType,
                    initialMode: "b-mode",
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                  <p className="text-muted-foreground">
                    Selecione um tipo de laboratório para visualizar
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={loading} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Salvando..." : "Salvar Laboratório Virtual"}
        </Button>
      </div>
    </div>
  );
}
