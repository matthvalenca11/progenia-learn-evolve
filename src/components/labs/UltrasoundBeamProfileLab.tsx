import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Waves, AlertTriangle } from "lucide-react";

interface UltrasoundBeamProfileLabProps {
  config?: {
    title?: string;
    description?: string;
  };
}

export function UltrasoundBeamProfileLab({ config }: UltrasoundBeamProfileLabProps) {
  const [era, setEra] = useState(5); // cm²
  const [bnr, setBnr] = useState(5); // Beam Nonuniformity Ratio
  const [power, setPower] = useState(5); // W

  // Generate heatmap based on BNR
  const generateHeatmap = () => {
    const gridSize = 10;
    const cells = [];
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        // Center of the grid
        const centerX = gridSize / 2;
        const centerY = gridSize / 2;
        
        // Distance from center (normalized)
        const distance = Math.sqrt(
          Math.pow(i - centerX, 2) + Math.pow(j - centerY, 2)
        ) / (gridSize / 2);
        
        // Generate intensity with hot spots based on BNR
        // Higher BNR = more variation, more hot spots
        const baseIntensity = 1 - distance * 0.5;
        const variation = Math.random() * (bnr / 10);
        let intensity = baseIntensity + variation;
        
        // Add some hot spots for high BNR
        if (bnr > 6 && Math.random() > 0.85) {
          intensity *= 1.5;
        }
        
        // Normalize
        intensity = Math.max(0, Math.min(1, intensity));
        
        // Color based on intensity
        let bgColor;
        if (intensity < 0.3) {
          bgColor = "bg-blue-400";
        } else if (intensity < 0.6) {
          bgColor = "bg-yellow-400";
        } else if (intensity < 0.8) {
          bgColor = "bg-orange-500";
        } else {
          bgColor = "bg-red-600";
        }
        
        cells.push(
          <div
            key={`${i}-${j}`}
            className={`${bgColor} transition-colors`}
            style={{
              opacity: 0.3 + intensity * 0.7,
            }}
          />
        );
      }
    }
    
    return cells;
  };

  const getBNRRisk = () => {
    if (bnr < 4) return { level: "Baixo", color: "bg-green-500", desc: "Campo uniforme, menor risco de pontos quentes" };
    if (bnr <= 6) return { level: "Moderado", color: "bg-yellow-500", desc: "Distribuição aceitável para uso clínico" };
    return { level: "Alto", color: "bg-red-500", desc: "Alto risco de pontos quentes, requer movimento constante" };
  };

  const risk = getBNRRisk();
  const peakIntensity = (power / era) * bnr;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Waves className="h-6 w-6 text-primary" />
          {config?.title || "Perfil de Feixe e Hot Spots do Ultrassom"}
        </h3>
        {config?.description && (
          <p className="text-muted-foreground">{config.description}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Parâmetros do Transdutor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="flex items-center justify-between mb-2">
                <span>ERA (Área Efetiva de Radiação)</span>
                <Badge variant="secondary">{era} cm²</Badge>
              </Label>
              <Slider
                value={[era]}
                onValueChange={(value) => setEra(value[0])}
                min={3}
                max={10}
                step={0.5}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Área efetiva que emite ultrassom
              </p>
            </div>

            <div>
              <Label className="flex items-center justify-between mb-2">
                <span>BNR (Beam Nonuniformity Ratio)</span>
                <Badge variant="secondary">{bnr}:1</Badge>
              </Label>
              <Slider
                value={[bnr]}
                onValueChange={(value) => setBnr(value[0])}
                min={2}
                max={10}
                step={0.5}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Razão entre intensidade de pico e média
              </p>
            </div>

            <div>
              <Label className="flex items-center justify-between mb-2">
                <span>Potência de Saída</span>
                <Badge variant="secondary">{power} W</Badge>
              </Label>
              <Slider
                value={[power]}
                onValueChange={(value) => setPower(value[0])}
                min={1}
                max={20}
                step={0.5}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Potência acústica total do aparelho
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Beam Profile Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Perfil do Feixe Ultrassônico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-square border-2 border-border rounded-lg p-4">
              <div className="w-full h-full grid grid-cols-10 gap-1">
                {generateHeatmap()}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-400 rounded"></div>
                <span>Baixa</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                <span>Média</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span>Alta</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-600 rounded"></div>
                <span>Pico</span>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Intensidade Média</span>
                <Badge>{(power / era).toFixed(2)} W/cm²</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Intensidade de Pico</span>
                <Badge>{peakIntensity.toFixed(2)} W/cm²</Badge>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${risk.color} bg-opacity-10 border-2 border-current`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold">Risco de Hot Spots: {risk.level}</span>
              </div>
              <p className="text-xs">{risk.desc}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clinical Explanation */}
      <Card>
        <CardHeader>
          <CardTitle>Compreensão Clínica do BNR e Hot Spots</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm mb-1">O que é BNR?</h4>
            <p className="text-sm text-muted-foreground">
              O BNR (Beam Nonuniformity Ratio) indica quão uniforme é a distribuição da energia 
              ultrassônica no feixe. Um BNR de 5:1 significa que a intensidade de pico é 5 vezes 
              maior que a intensidade média. Equipamentos modernos têm BNR entre 2:1 e 8:1.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1">Hot Spots e Desconforto</h4>
            <p className="text-sm text-muted-foreground">
              Hot spots são áreas de alta intensidade localizadas no campo ultrassônico. 
              BNR alto (&gt;6:1) aumenta o risco de desconforto, periosteal pain, e cavitação 
              não terapêutica. Esses pontos quentes podem causar sensação de queimação ou dor.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1">Técnica de Aplicação</h4>
            <p className="text-sm text-muted-foreground">
              Para minimizar efeitos adversos de hot spots: (1) Mover o transdutor continuamente 
              em círculos lentos ou em varredura, (2) Usar gel adequado sem bolhas, (3) Manter 
              contato firme mas suave com a pele, (4) Nunca deixar o cabeçote parado em modo contínuo.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1">BNR Ideal</h4>
            <p className="text-sm text-muted-foreground">
              BNR &lt; 6:1 é considerado aceitável para terapia. BNR entre 2:1 e 4:1 é ótimo, 
              proporcionando campo mais uniforme. Equipamentos com BNR alto exigem mais atenção 
              na técnica de movimentação do transdutor durante a aplicação.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
