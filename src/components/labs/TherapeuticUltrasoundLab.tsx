import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Waves, Zap, Activity } from "lucide-react";

interface TherapeuticUltrasoundLabProps {
  config?: {
    title?: string;
    description?: string;
  };
}

export function TherapeuticUltrasoundLab({ config }: TherapeuticUltrasoundLabProps) {
  const [frequency, setFrequency] = useState<"1" | "3">("1"); // MHz
  const [intensity, setIntensity] = useState(1.0); // W/cm²
  const [era, setEra] = useState(5); // cm²
  const [mode, setMode] = useState<"continuous" | "pulsed">("continuous");
  const [dutyCycle, setDutyCycle] = useState(50); // % (only for pulsed)
  const [duration, setDuration] = useState(5); // minutes

  // Cálculos
  const power = intensity * era; // W
  const effectiveIntensity = mode === "pulsed" ? intensity * (dutyCycle / 100) : intensity;
  const totalEnergy = power * duration * 60; // J
  const energyPerArea = totalEnergy / era; // J/cm²

  const getDoseRange = () => {
    if (energyPerArea < 300) return { level: "Baixa", color: "bg-blue-500", effect: "Efeito biológico mínimo, anti-inflamatório leve" };
    if (energyPerArea < 900) return { level: "Moderada", color: "bg-yellow-500", effect: "Efeito terapêutico padrão, reparo tecidual" };
    if (energyPerArea < 1500) return { level: "Alta", color: "bg-orange-500", effect: "Efeito térmico pronunciado, tecidos profundos" };
    return { level: "Muito Alta", color: "bg-red-500", effect: "Risco de aquecimento excessivo, usar com cautela" };
  };

  const getFrequencyEffect = () => {
    if (frequency === "1") {
      return "Penetração profunda (até 5 cm), ideal para tecidos profundos e articulações";
    }
    return "Penetração superficial (até 2 cm), ideal para tecidos superficiais e músculos";
  };

  const getModeEffect = () => {
    if (mode === "continuous") {
      return "Efeito térmico contínuo, aquecimento de tecidos";
    }
    return `Efeito pulsado (${dutyCycle}% duty cycle), predominantemente não-térmico`;
  };

  const dose = getDoseRange();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Waves className="h-6 w-6 text-primary" />
          {config?.title || "Laboratório de Dosagem em Ultrassom Terapêutico"}
        </h3>
        {config?.description && (
          <p className="text-muted-foreground">{config.description}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Controles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Parâmetros de Aplicação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="mb-3 block">Frequência do Transdutor</Label>
              <RadioGroup value={frequency} onValueChange={(val) => setFrequency(val as "1" | "3")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="freq-1" />
                  <Label htmlFor="freq-1" className="flex-1 cursor-pointer">
                    1 MHz - Tecidos Profundos
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="freq-3" />
                  <Label htmlFor="freq-3" className="flex-1 cursor-pointer">
                    3 MHz - Tecidos Superficiais
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground mt-2">
                {getFrequencyEffect()}
              </p>
            </div>

            <div>
              <Label className="flex items-center justify-between mb-2">
                <span>Intensidade (SATA)</span>
                <Badge variant="secondary">{intensity.toFixed(1)} W/cm²</Badge>
              </Label>
              <Slider
                value={[intensity]}
                onValueChange={(value) => setIntensity(value[0])}
                min={0.1}
                max={3.0}
                step={0.1}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Potência por unidade de área (espacial e temporal médio)
              </p>
            </div>

            <div>
              <Label className="flex items-center justify-between mb-2">
                <span>ERA do Transdutor</span>
                <Badge variant="secondary">{era} cm²</Badge>
              </Label>
              <Slider
                value={[era]}
                onValueChange={(value) => setEra(value[0])}
                min={1}
                max={10}
                step={0.5}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Área Efetiva de Radiação do cabeçote
              </p>
            </div>

            <div>
              <Label className="mb-3 block">Modo de Operação</Label>
              <RadioGroup value={mode} onValueChange={(val) => setMode(val as "continuous" | "pulsed")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="continuous" id="mode-cont" />
                  <Label htmlFor="mode-cont" className="flex-1 cursor-pointer">
                    Contínuo
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pulsed" id="mode-pulsed" />
                  <Label htmlFor="mode-pulsed" className="flex-1 cursor-pointer">
                    Pulsado
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground mt-2">
                {getModeEffect()}
              </p>
            </div>

            {mode === "pulsed" && (
              <div>
                <Label className="flex items-center justify-between mb-2">
                  <span>Duty Cycle</span>
                  <Badge variant="secondary">{dutyCycle}%</Badge>
                </Label>
                <Slider
                  value={[dutyCycle]}
                  onValueChange={(value) => setDutyCycle(value[0])}
                  min={10}
                  max={100}
                  step={10}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Percentual de tempo ativo em cada ciclo
                </p>
              </div>
            )}

            <div>
              <Label className="flex items-center justify-between mb-2">
                <span>Duração da Sessão</span>
                <Badge variant="secondary">{duration} min</Badge>
              </Label>
              <Slider
                value={[duration]}
                onValueChange={(value) => setDuration(value[0])}
                min={1}
                max={20}
                step={1}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tempo total de aplicação
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <Card>
          <CardHeader>
            <CardTitle>Cálculos de Dosagem</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Potência Acústica</span>
                <Badge className="text-base">{power.toFixed(2)} W</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                P = I × ERA = {intensity.toFixed(1)} × {era} cm²
              </p>
            </div>

            {mode === "pulsed" && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Intensidade Efetiva (SATA)</span>
                  <Badge className="text-base">{effectiveIntensity.toFixed(2)} W/cm²</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Intensidade média considerando o duty cycle
                </p>
              </div>
            )}

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Energia Total Entregue</span>
                <Badge className="text-base">{totalEnergy.toFixed(0)} J</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Energia total transmitida ao tecido
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Densidade de Energia</span>
                <Badge className="text-base">{energyPerArea.toFixed(0)} J/cm²</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Energia por unidade de área tratada
              </p>
            </div>

            <div className={`p-4 rounded-lg ${dose.color} bg-opacity-10 border-2 border-current`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Faixa de Dose</span>
                <Badge className={`${dose.color} text-white`}>{dose.level}</Badge>
              </div>
              <p className="text-xs font-medium">
                {dose.effect}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Explicação Clínica */}
      <Card>
        <CardHeader>
          <CardTitle>Princípios Clínicos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm mb-1">Frequência e Penetração</h4>
            <p className="text-sm text-muted-foreground">
              1 MHz penetra até 5 cm, ideal para articulações profundas e tecidos espessos. 
              3 MHz penetra até 2 cm, melhor para músculos superficiais e tecido subcutâneo.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1">Modo Contínuo vs Pulsado</h4>
            <p className="text-sm text-muted-foreground">
              Modo contínuo gera calor profundo (efeito térmico). Modo pulsado reduz aquecimento 
              e permite efeitos não-térmicos como reparo celular e modulação inflamatória.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1">Intensidade e Segurança</h4>
            <p className="text-sm text-muted-foreground">
              Intensidades acima de 2.0 W/cm² em modo contínuo podem causar aquecimento excessivo. 
              Sempre monitorar sensação térmica do paciente. Áreas com pouca vascularização requerem cautela adicional.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
