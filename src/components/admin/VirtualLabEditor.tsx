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
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { virtualLabService, VirtualLab, VirtualLabType } from "@/services/virtualLabService";
import { getAllPresets, getDefaultLayersForPreset, getDefaultInclusionsForPreset } from "@/config/ultrasoundPresets";
import { UltrasoundSimulatorAdvanced } from "@/components/labs/UltrasoundSimulatorAdvanced";
import { useMemo, useCallback } from "react";
import { AcousticLayersEditor } from "./AcousticLayersEditor";
import { InclusionsEditor } from "./InclusionsEditor";

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
        layers: getDefaultLayersForPreset("generic_muscle"),
        inclusions: getDefaultInclusionsForPreset("generic_muscle"),
      },
    },
  });

  const allPresets = getAllPresets();

  useEffect(() => {
    if (isEdit && labId) {
      loadLab();
    }
  }, [labId, isEdit]);

  const loadLab = async () => {
    try {
      setLoading(true);
      const data = await virtualLabService.getLabById(labId!);
      if (data) {
        // Ensure layers and inclusions exist
        if (data.config_data.ultrasoundConfig && !data.config_data.ultrasoundConfig.layers) {
          data.config_data.ultrasoundConfig.layers = getDefaultLayersForPreset(
            data.config_data.ultrasoundConfig.presetId
          );
        }
        if (data.config_data.ultrasoundConfig && !data.config_data.ultrasoundConfig.inclusions) {
          data.config_data.ultrasoundConfig.inclusions = getDefaultInclusionsForPreset(
            data.config_data.ultrasoundConfig.presetId
          );
        }
        setLab(data);
      }
    } catch (error: any) {
      console.error("Error loading lab:", error);
      toast.error("Erro ao carregar laboratório", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!lab.name?.trim()) {
      toast.error("Validação", { description: "O nome do laboratório é obrigatório" });
      return;
    }

    if (!lab.lab_type) {
      toast.error("Validação", { description: "O tipo de laboratório é obrigatório" });
      return;
    }

    if (lab.lab_type === "ultrasound" && !lab.config_data.ultrasoundConfig?.presetId) {
      toast.error("Validação", { description: "Selecione um preset de anatomia" });
      return;
    }

    try {
      setLoading(true);
      if (isEdit && labId) {
        await virtualLabService.updateLab(labId, lab);
        toast.success("Sucesso!", { description: "Laboratório atualizado com sucesso" });
      } else {
        await virtualLabService.createLab(lab);
        toast.success("Sucesso!", { description: "Laboratório criado com sucesso" });
      }
      navigate("/admin/labs");
    } catch (error: any) {
      console.error("Error saving lab:", error);
      toast.error("Erro ao salvar", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const ultrasoundConfig = lab.config_data.ultrasoundConfig;
  const currentPreset = useMemo(
    () => ultrasoundConfig ? allPresets.find(p => p.id === ultrasoundConfig.presetId) : null,
    [ultrasoundConfig?.presetId]
  );

  const handlePresetChange = useCallback((presetId: string) => {
    if (!ultrasoundConfig) return;
    
    const newPreset = allPresets.find(p => p.id === presetId);
    
    setLab({
      ...lab,
      config_data: {
        ...lab.config_data,
        ultrasoundConfig: {
          ...ultrasoundConfig,
          presetId: presetId as any,
          layers: getDefaultLayersForPreset(presetId as any),
          inclusions: getDefaultInclusionsForPreset(presetId as any),
        },
      },
    });
    
    if (newPreset) {
      toast.info("Preset alterado", { 
        description: `Camadas redefinidas. Transdutor recomendado: ${
          newPreset.transducerType === 'linear' ? 'Linear' : 
          newPreset.transducerType === 'convex' ? 'Convexo' : 
          'Microconvexo'
        } (${newPreset.recommendedFrequencyMHz} MHz)` 
      });
    }
  }, [lab, ultrasoundConfig, allPresets]);

  // Memoize simulator config to prevent unnecessary re-renders
  const simulatorConfig = useMemo(() => {
    if (!ultrasoundConfig || !currentPreset) return null;
    
    return {
      enabled: true,
      showGain: ultrasoundConfig.controls.showGain,
      showDepth: ultrasoundConfig.controls.showDepth,
      showFrequency: ultrasoundConfig.controls.showFrequency,
      showFocus: ultrasoundConfig.controls.showFocus,
      showTGC: false,
      showDynamicRange: false,
      showTransducerSelector: false,
      showModeSelector: false,
      presetAnatomy: (currentPreset.tissueProfile || "muscle") as any,
      lockGain: false,
      lockDepth: false,
      lockFrequency: false,
      lockTransducer: false,
      initialGain: currentPreset.recommendedGain || 50,
      initialDepth: currentPreset.recommendedDepthCm || 6,
      initialFrequency: currentPreset.recommendedFrequencyMHz || 7.5,
      initialTransducer: (currentPreset.transducerType === 'linear' || currentPreset.transducerType === 'convex' || currentPreset.transducerType === 'microconvex') 
        ? currentPreset.transducerType 
        : "linear" as const,
      initialMode: "b-mode" as const,
    };
  }, [
    ultrasoundConfig?.controls.showGain,
    ultrasoundConfig?.controls.showDepth,
    ultrasoundConfig?.controls.showFrequency,
    ultrasoundConfig?.controls.showFocus,
    currentPreset?.tissueProfile,
    currentPreset?.recommendedGain,
    currentPreset?.recommendedDepthCm,
    currentPreset?.recommendedFrequencyMHz,
    currentPreset?.transducerType,
  ]);

  if (loading && isEdit) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando laboratório...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate("/admin/labs")} disabled={loading}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {isEdit ? "Editar Laboratório Virtual" : "Novo Laboratório Virtual"}
          </h1>
          <p className="text-muted-foreground">
            Configure um laboratório virtual reutilizável para anexar a múltiplas cápsulas
          </p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar laboratório
            </>
          )}
        </Button>
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
                      onValueChange={handlePresetChange}
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

              {/* Acoustic Layers */}
              <AcousticLayersEditor
                layers={ultrasoundConfig.layers || []}
                onChange={(layers) => setLab({
                  ...lab,
                  config_data: {
                    ...lab.config_data,
                    ultrasoundConfig: {
                      ...ultrasoundConfig,
                      layers,
                    },
                  },
                })}
              />

              {/* Inclusions */}
              <InclusionsEditor
                inclusions={ultrasoundConfig.inclusions || []}
                onChange={(inclusions) => setLab({
                  ...lab,
                  config_data: {
                    ...lab.config_data,
                    ultrasoundConfig: {
                      ...ultrasoundConfig,
                      inclusions,
                    },
                  },
                })}
              />

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
        <div className="space-y-6 lg:sticky lg:top-4 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Pré-visualização</CardTitle>
              <CardDescription>Visualização em tempo real do laboratório configurado</CardDescription>
            </CardHeader>
            <CardContent>
              {lab.lab_type === "ultrasound" && simulatorConfig ? (
                <div className="rounded-lg overflow-hidden bg-black">
                  <UltrasoundSimulatorAdvanced config={simulatorConfig} />
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Selecione um tipo de laboratório para ver a pré-visualização</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick help */}
          <Card>
            <CardHeader>
              <CardTitle>Dicas</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Configure as camadas acústicas para definir a propagação do ultrassom</p>
              <p>• Adicione inclusões para simular cistos, vasos, ossos e lesões</p>
              <p>• A diferença de impedância entre meios afeta reflexões e sombreamento</p>
              <p>• Meios anecoicos (água, cistos) produzem reforço posterior</p>
              <p>• Interfaces ósseas produzem sombras acústicas intensas</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
