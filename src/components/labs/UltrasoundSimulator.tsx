import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UltrasoundSimulatorProps {
  config: {
    base_image?: string;
    title?: string;
    description?: string;
  };
}

export const UltrasoundSimulator = ({ config }: UltrasoundSimulatorProps) => {
  const [brightness, setBrightness] = useState(100);
  const [depth, setDepth] = useState(50);
  const [frequency, setFrequency] = useState("7.5");

  const getImageStyle = () => {
    return {
      filter: `brightness(${brightness}%) contrast(${100 + (depth - 50) / 2}%)`,
      transform: `scale(${1 + depth / 200})`,
    };
  };

  const getExplanation = () => {
    const explanations = [];
    
    if (brightness > 120) {
      explanations.push("⚠️ Ganho muito alto pode gerar artefatos e reduzir contraste");
    } else if (brightness < 80) {
      explanations.push("⚠️ Ganho muito baixo pode ocultar estruturas importantes");
    } else {
      explanations.push("✓ Ganho adequado para boa visualização");
    }

    if (depth > 70) {
      explanations.push("⚠️ Profundidade alta reduz resolução superficial");
    } else if (depth < 30) {
      explanations.push("⚠️ Profundidade baixa limita visualização de estruturas profundas");
    } else {
      explanations.push("✓ Profundidade adequada para este exame");
    }

    const freqNum = parseFloat(frequency);
    if (freqNum > 10) {
      explanations.push("Alta frequência: melhor resolução, menor penetração");
    } else if (freqNum < 5) {
      explanations.push("Baixa frequência: maior penetração, menor resolução");
    } else {
      explanations.push("Frequência média: bom equilíbrio para aplicações gerais");
    }

    return explanations;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">
          {config.title || "Simulador de Parâmetros de Ultrassom"}
        </h3>
        {config.description && (
          <p className="text-muted-foreground">{config.description}</p>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Image Display */}
        <Card className="md:col-span-2 p-6">
          <div className="aspect-video bg-black rounded-lg flex items-center justify-center overflow-hidden">
            {config.base_image ? (
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={config.base_image}
                  alt="Ultrassom"
                  style={getImageStyle()}
                  className="max-w-full max-h-full object-contain transition-all duration-300"
                />
              </div>
            ) : (
              <div className="text-center text-white/50">
                <p>Nenhuma imagem base configurada</p>
                <p className="text-sm mt-2">Configure a imagem no admin</p>
              </div>
            )}
          </div>
        </Card>

        {/* Controls Panel */}
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Controles do Transdutor</h4>
          
          <div className="space-y-6">
            <div>
              <Label>Ganho / Brilho</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Controla a intensidade do sinal
              </p>
              <Slider
                value={[brightness]}
                onValueChange={(value) => setBrightness(value[0])}
                min={50}
                max={150}
                step={5}
              />
              <p className="text-sm text-right mt-1">{brightness}%</p>
            </div>

            <div>
              <Label>Profundidade / Foco</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Ajusta a profundidade de penetração
              </p>
              <Slider
                value={[depth]}
                onValueChange={(value) => setDepth(value[0])}
                min={0}
                max={100}
                step={5}
              />
              <p className="text-sm text-right mt-1">{depth}%</p>
            </div>

            <div>
              <Label>Frequência (MHz)</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Afeta resolução e penetração
              </p>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3.5">3.5 MHz - Baixa</SelectItem>
                  <SelectItem value="5.0">5.0 MHz - Média-Baixa</SelectItem>
                  <SelectItem value="7.5">7.5 MHz - Média</SelectItem>
                  <SelectItem value="10.0">10.0 MHz - Média-Alta</SelectItem>
                  <SelectItem value="12.0">12.0 MHz - Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>

      {/* Explanation Panel */}
      <Card className="p-6">
        <h4 className="font-semibold mb-3">Feedback dos Parâmetros</h4>
        <div className="space-y-2">
          {getExplanation().map((text, i) => (
            <p key={i} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>{text}</span>
            </p>
          ))}
        </div>
      </Card>
    </div>
  );
};