import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Waves } from "lucide-react";

interface TherapeuticUltrasoundLabProps {
  config?: {
    title?: string;
    description?: string;
  };
}

export function TherapeuticUltrasoundLab({ config }: TherapeuticUltrasoundLabProps) {
  const [frequency, setFrequency] = useState<"1" | "3">("1");
  const [intensity, setIntensity] = useState(1.0);
  const [era, setEra] = useState(5);
  const [mode, setMode] = useState<"continuous" | "pulsed">("continuous");
  const [dutyCycle, setDutyCycle] = useState(50);
  const [duration, setDuration] = useState(5);

  const power = intensity * era;
  const duty = mode === "pulsed" ? dutyCycle / 100 : 1.0;
  const timeSeconds = duration * 60;
  const totalEnergy = power * timeSeconds * duty;
  const dosePerArea = intensity * timeSeconds * duty;

  const getDoseRange = () => {
    if (dosePerArea < 300) return { level: "Baixa", color: "bg-blue-500", effect: "Efeito biológico mínimo, anti-inflamatório leve" };
    if (dosePerArea < 900) return { level: "Moderada", color: "bg-yellow-500", effect: "Efeito terapêutico padrão, reparo tecidual" };
    if (dosePerArea < 1500) return { level: "Alta", color: "bg-orange-500", effect: "Efeito térmico pronunciado" };
    return { level: "Muito Alta", color: "bg-red-500", effect: "Risco de aquecimento excessivo" };
  };

  const dose = getDoseRange();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Waves className="h-6 w-6 text-primary" />
          {config?.title || "Laboratório de Ultrassom Terapêutico"}
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Parâmetros</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="mb-3 block">Frequência</Label>
              <RadioGroup value={frequency} onValueChange={(v) => setFrequency(v as "1" | "3")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="f1" />
                  <Label htmlFor="f1">1 MHz - Profundo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="f3" />
                  <Label htmlFor="f3">3 MHz - Superficial</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="flex items-center justify-between mb-2">
                <span>Intensidade</span>
                <Badge>{intensity.toFixed(1)} W/cm²</Badge>
              </Label>
              <Slider value={[intensity]} onValueChange={(v) => setIntensity(v[0])} min={0.1} max={2.5} step={0.1} />
            </div>

            <div>
              <Label className="flex items-center justify-between mb-2">
                <span>ERA</span>
                <Badge>{era} cm²</Badge>
              </Label>
              <Slider value={[era]} onValueChange={(v) => setEra(v[0])} min={3} max={10} step={0.5} />
            </div>

            <div>
              <Label className="mb-3 block">Modo</Label>
              <RadioGroup value={mode} onValueChange={(v) => setMode(v as "continuous" | "pulsed")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="continuous" id="cont" />
                  <Label htmlFor="cont">Contínuo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pulsed" id="pul" />
                  <Label htmlFor="pul">Pulsado</Label>
                </div>
              </RadioGroup>
            </div>

            {mode === "pulsed" && (
              <div>
                <Label className="flex items-center justify-between mb-2">
                  <span>Duty Cycle</span>
                  <Badge>{dutyCycle}%</Badge>
                </Label>
                <Slider value={[dutyCycle]} onValueChange={(v) => setDutyCycle(v[0])} min={10} max={100} step={10} />
              </div>
            )}

            <div>
              <Label className="flex items-center justify-between mb-2">
                <span>Duração</span>
                <Badge>{duration} min</Badge>
              </Label>
              <Slider value={[duration]} onValueChange={(v) => setDuration(v[0])} min={1} max={20} step={1} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Resultados</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Potência</span>
                <Badge>{power.toFixed(2)} W</Badge>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Energia Total</span>
                <Badge>{totalEnergy.toFixed(0)} J</Badge>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Densidade</span>
                <Badge>{dosePerArea.toFixed(0)} J/cm²</Badge>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${dose.color} bg-opacity-10 border-2`}>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Dose</span>
                <Badge className={`${dose.color} text-white`}>{dose.level}</Badge>
              </div>
              <p className="text-xs">{dose.effect}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
