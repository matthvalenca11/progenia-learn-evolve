import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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

  // Cálculos de dosagem
  const chargePerPulse = (currentIntensity * pulseWidth) / 1000; // mC
  const pulsesPerSession = frequency * duration * 60;
  const totalCharge = (chargePerPulse * pulsesPerSession) / 1000; // Coulombs

  const getDoseClassification = () => {
    if (totalCharge < 50) return { level: "Baixa", color: "bg-blue-500", desc: "Dosagem suave, ideal para início de tratamento" };
    if (totalCharge < 150) return { level: "Moderada", color: "bg-yellow-500", desc: "Dosagem terapêutica padrão" };
    return { level: "Alta", color: "bg-orange-500", desc: "Dosagem intensa, para fortalecimento avançado" };
  };

  const getFrequencyEffect = () => {
    if (frequency < 10) return "Contração tetânica, fortalecimento muscular";
    if (frequency <= 50) return "Efeito misto: motor e sensorial";
    if (frequency <= 100) return "Predominantemente analgésico";
    return "Bloqueio de dor, modulação sensorial";
  };

  const getPulseWidthEffect = () => {
    if (pulseWidth < 150) return "Recrutamento superficial, mais confortável";
    if (pulseWidth <= 300) return "Recrutamento balanceado, uso clínico padrão";
    return "Recrutamento profundo, maior efeito motor";
  };

  const dose = getDoseClassification();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          {config?.title || "Laboratório de Dosagem em Eletroterapia"}
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
              Parâmetros de Estimulação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="flex items-center justify-between mb-2">
                <span>Intensidade de Corrente</span>
                <Badge variant="secondary">{currentIntensity} mA</Badge>
              </Label>
              <Slider
                value={[currentIntensity]}
                onValueChange={(value) => setCurrentIntensity(value[0])}
                min={5}
                max={100}
                step={5}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Amplitude da corrente elétrica aplicada
              </p>
            </div>

            <div>
              <Label className="flex items-center justify-between mb-2">
                <span>Largura de Pulso</span>
                <Badge variant="secondary">{pulseWidth} µs</Badge>
              </Label>
              <Slider
                value={[pulseWidth]}
                onValueChange={(value) => setPulseWidth(value[0])}
                min={50}
                max={500}
                step={25}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {getPulseWidthEffect()}
              </p>
            </div>

            <div>
              <Label className="flex items-center justify-between mb-2">
                <span>Frequência</span>
                <Badge variant="secondary">{frequency} Hz</Badge>
              </Label>
              <Slider
                value={[frequency]}
                onValueChange={(value) => setFrequency(value[0])}
                min={1}
                max={200}
                step={5}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {getFrequencyEffect()}
              </p>
            </div>

            <div>
              <Label className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Duração da Sessão
                </span>
                <Badge variant="secondary">{duration} min</Badge>
              </Label>
              <Slider
                value={[duration]}
                onValueChange={(value) => setDuration(value[0])}
                min={5}
                max={60}
                step={5}
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
                <span className="text-sm font-medium">Carga por Pulso</span>
                <Badge className="text-base">{chargePerPulse.toFixed(2)} mC</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Quantidade de carga elétrica em cada pulso individual
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Pulsos por Sessão</span>
                <Badge className="text-base">{pulsesPerSession.toLocaleString()}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Total de pulsos aplicados durante toda a sessão
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Carga Total</span>
                <Badge className="text-base">{totalCharge.toFixed(1)} C</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Carga elétrica acumulada durante a sessão completa
              </p>
            </div>

            <div className={`p-4 rounded-lg ${dose.color} bg-opacity-10 border-2 border-current`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Classificação da Dose</span>
                <Badge className={`${dose.color} text-white`}>{dose.level}</Badge>
              </div>
              <p className="text-xs font-medium">
                {dose.desc}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Explicação Clínica */}
      <Card>
        <CardHeader>
          <CardTitle>Fundamentos da Dosagem</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm mb-1">Carga por Pulso (Q = I × t)</h4>
            <p className="text-sm text-muted-foreground">
              A carga elétrica de cada pulso depende da intensidade (mA) e da duração do pulso (µs). 
              Pulsos mais longos e intensos carregam mais carga.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1">Frequência e Efeito Fisiológico</h4>
            <p className="text-sm text-muted-foreground">
              Baixas frequências (&lt;10 Hz) produzem contrações musculares visíveis. 
              Altas frequências (50-100 Hz) têm efeito predominantemente analgésico por bloqueio de portão.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1">Dose Total e Segurança</h4>
            <p className="text-sm text-muted-foreground">
              A carga total (Coulombs) determina a dose terapêutica. Doses excessivas podem causar fadiga muscular 
              ou desconforto. Sempre respeitar tolerância do paciente e objetivos clínicos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
