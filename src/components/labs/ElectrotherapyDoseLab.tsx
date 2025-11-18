import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Activity, Clock } from "lucide-react";

interface ElectrotherapyDoseLabProps {
  config?: {
    title?: string;
    description?: string;
  };
}

export function ElectrotherapyDoseLab({ config }: ElectrotherapyDoseLabProps) {
  const [currentIntensity, setCurrentIntensity] = useState(20); // mA
  const [pulseWidth, setPulseWidth] = useState(250); // µs
  const [frequency, setFrequency] = useState(50); // Hz
  const [duration, setDuration] = useState(20); // minutes
  const [waveform, setWaveform] = useState<string>("biphasic_symmetric");

  // Physics calculations
  let effectivePulseWidthSec: number;
  let effectiveFrequency: number;

  if (waveform === "russian") {
    effectivePulseWidthSec = 1 / 2500 / 1_000_000;
    effectiveFrequency = 50;
  } else {
    effectivePulseWidthSec = pulseWidth / 1_000_000;
    effectiveFrequency = frequency;
  }

  const currentAmps = currentIntensity / 1000;
  const chargePerPulseCoulombs = currentAmps * effectivePulseWidthSec;
  const chargePerPulseMC = chargePerPulseCoulombs * 1000;
  const pulsesPerSession = effectiveFrequency * duration * 60;
  const totalChargeMC = chargePerPulseMC * pulsesPerSession;
  const totalChargeCoulombs = totalChargeMC / 1000;

  const getDoseClassification = () => {
    if (totalChargeCoulombs < 50)
      return { level: "Baixa", color: "bg-blue-500", desc: "Dosagem suave, ideal para início de tratamento ou sensibilização" };
    if (totalChargeCoulombs < 150)
      return { level: "Moderada", color: "bg-yellow-500", desc: "Dosagem terapêutica padrão para fortalecimento e analgesia" };
    if (totalChargeCoulombs < 250)
      return { level: "Alta", color: "bg-orange-500", desc: "Dosagem intensa para fortalecimento muscular avançado" };
    return { level: "Muito Alta", color: "bg-red-500", desc: "Dosagem extrema - risco de fadiga muscular, usar com cautela" };
  };

  const getFrequencyEffect = () => {
    if (frequency < 10) return "Contração muscular visível, fortalecimento, fibras tipo II";
    if (frequency <= 50) return "Efeito misto: recrutamento motor e sensorial balanceado";
    if (frequency <= 100) return "Predominantemente analgésico (teoria do portão)";
    return "Bloqueio sensorial, modulação de dor crônica";
  };

  const getPulseWidthEffect = () => {
    if (pulseWidth < 150) return "Recrutamento superficial, fibras nervosas finas, mais confortável";
    if (pulseWidth <= 300) return "Recrutamento balanceado, uso clínico padrão, fibras mistas";
    return "Recrutamento profundo, maior recrutamento motor, fibras grossas";
  };

  const getWaveformDescription = () => {
    switch (waveform) {
      case "monophasic": return "Fluxo unidirecional de corrente, maior risco de iontoforese cutânea e desconforto";
      case "biphasic_symmetric": return "Fluxo bidirecional balanceado, confortável, sem acúmulo de carga";
      case "biphasic_asymmetric": return "Fases assimétricas, permite ajuste fino de conforto e eficácia";
      case "russian": return "Corrente Russa: burst de 2500 Hz modulado a 50 Hz, otimizado para fortalecimento";
      default: return "";
    }
  };

  const dose = getDoseClassification();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          {config?.title || "Laboratório de Dosagem em Eletroterapia"}
        </h3>
        {config?.description && <p className="text-muted-foreground">{config.description}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Parâmetros de Estimulação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="mb-3 block">Tipo de Forma de Onda</Label>
              <Select value={waveform} onValueChange={setWaveform}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monophasic">Monofásica</SelectItem>
                  <SelectItem value="biphasic_symmetric">Bifásica Simétrica</SelectItem>
                  <SelectItem value="biphasic_asymmetric">Bifásica Assimétrica</SelectItem>
                  <SelectItem value="russian">Estimulação Russa (2500 Hz)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">{getWaveformDescription()}</p>
            </div>

            <div>
              <Label className="flex items-center justify-between mb-2">
                <span>Intensidade de Corrente</span>
                <Badge variant="secondary">{currentIntensity} mA</Badge>
              </Label>
              <Slider value={[currentIntensity]} onValueChange={(v) => setCurrentIntensity(v[0])} min={1} max={120} step={1} />
            </div>

            {waveform !== "russian" && (
              <>
                <div>
                  <Label className="flex items-center justify-between mb-2">
                    <span>Largura de Pulso</span>
                    <Badge variant="secondary">{pulseWidth} µs</Badge>
                  </Label>
                  <Slider value={[pulseWidth]} onValueChange={(v) => setPulseWidth(v[0])} min={50} max={1000} step={10} />
                  <p className="text-xs text-muted-foreground mt-1">{getPulseWidthEffect()}</p>
                </div>

                <div>
                  <Label className="flex items-center justify-between mb-2">
                    <span>Frequência</span>
                    <Badge variant="secondary">{frequency} Hz</Badge>
                  </Label>
                  <Slider value={[frequency]} onValueChange={(v) => setFrequency(v[0])} min={1} max={150} step={1} />
                  <p className="text-xs text-muted-foreground mt-1">{getFrequencyEffect()}</p>
                </div>
              </>
            )}

            <div>
              <Label className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />Duração da Sessão</span>
                <Badge variant="secondary">{duration} min</Badge>
              </Label>
              <Slider value={[duration]} onValueChange={(v) => setDuration(v[0])} min={5} max={60} step={5} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Cálculos de Dosagem</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Carga por Pulso</span>
                <Badge className="text-base">{chargePerPulseMC.toFixed(3)} mC</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Q = I × t</p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Pulsos por Sessão</span>
                <Badge className="text-base">{pulsesPerSession.toLocaleString()}</Badge>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Carga Total</span>
                <Badge className="text-base">{totalChargeCoulombs.toFixed(1)} C</Badge>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${dose.color} bg-opacity-10 border-2 border-current`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Classificação da Dose</span>
                <Badge className={`${dose.color} text-white`}>{dose.level}</Badge>
              </div>
              <p className="text-xs font-medium">{dose.desc}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
