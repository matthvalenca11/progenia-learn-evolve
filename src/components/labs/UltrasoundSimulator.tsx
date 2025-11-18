import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface UltrasoundSimulatorProps {
  config?: {
    title?: string;
    description?: string;
  };
}

export const UltrasoundSimulator = ({ config }: UltrasoundSimulatorProps) => {
  // Sliders (keeping original names but mapping to physical model)
  const [gainPercent, setGainPercent] = useState(50); // 0-100 (Ganho/Brilho)
  const [focusPercent, setFocusPercent] = useState(50); // 0-100 (Profundidade/Foco)
  const [freqPercent, setFreqPercent] = useState(33); // 0-100 (Frequência)

  // Physical model calculations
  const results = useMemo(() => {
    const intensity = 0.1 + (gainPercent / 100) * 2.4; // 0.1-2.5 W/cm²
    const targetDepthCm = 1 + (focusPercent / 100) * 4; // 1-5 cm
    const frequencyMHz = 1 + (freqPercent / 100) * 2; // 1-3 MHz

    const eraCm2 = 5; // default ERA
    const timeSec = 300; // 5 min reference session

    const powerW = intensity * eraCm2;
    const energyJ = powerW * timeSec;
    const doseJPerCm2 = intensity * timeSec;

    let doseLabel = "Dose baixa (< 5 J/cm²)";
    if (doseJPerCm2 >= 5 && doseJPerCm2 <= 20) doseLabel = "Dose moderada (5–20 J/cm²)";
    if (doseJPerCm2 > 20) doseLabel = "Dose alta (> 20 J/cm²)";

    return {
      intensity,
      targetDepthCm,
      frequencyMHz,
      powerW,
      energyJ,
      doseJPerCm2,
      doseLabel,
    };
  }, [gainPercent, focusPercent, freqPercent]);

  // Visual factors
  const intensityFactor = gainPercent / 100;
  const waveDuration = 3 - results.frequencyMHz * 0.5; // faster for higher freq

  // Depth attenuation
  const depths = [1, 2, 3, 4, 5];
  const mu = results.frequencyMHz <= 1.5 ? 0.35 : 1.0;
  const depthIntensities = depths.map((z) => Math.exp(-mu * z));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">
          {config?.title || "Simulador de Parâmetros de Ultrassom"}
        </h3>
        {config?.description && (
          <p className="text-muted-foreground">{config.description}</p>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Synthetic Visualization */}
        <Card className="md:col-span-2 p-6">
          <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden relative">
            {/* Probe */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-24 h-8 rounded-xl bg-slate-100 shadow-lg flex items-center justify-center text-[10px] text-slate-700 font-medium z-10">
              Probe
            </div>

            {/* Tissue layers */}
            <div className="absolute inset-x-0 top-6 bottom-0">
              <div className="h-[20%] bg-amber-200/70 border-b border-amber-300/60 flex items-center px-3 text-[10px] text-slate-900 font-medium">
                Pele
              </div>
              <div className="h-[20%] bg-yellow-100/70 border-b border-yellow-200/70 flex items-center px-3 text-[10px] text-slate-900 font-medium">
                Tecido subcutâneo
              </div>
              <div className="h-[60%] bg-emerald-900/70 flex items-center px-3 text-[10px] text-emerald-100 font-medium">
                Músculo
              </div>
            </div>

            {/* Ultrasound waves */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute left-1/2 -translate-x-1/2 w-[70%] h-[120%] border-[2px] rounded-b-full pointer-events-none"
                style={{
                  borderColor: `rgba(56, 189, 248, ${0.15 + 0.5 * intensityFactor})`,
                  boxShadow: `0 0 ${8 + 20 * intensityFactor}px rgba(56, 189, 248, 0.6)`,
                  animation: `ultrasoundWave ${waveDuration}s linear infinite`,
                  animationDelay: `${(waveDuration / 3) * i}s`,
                }}
              />
            ))}

            {/* Treatment region glow (moves with focus) */}
            <div
              className="absolute inset-x-8 rounded-3xl bg-cyan-400/15 blur-2xl transition-all"
              style={{
                top: `${10 + (results.targetDepthCm / 5) * 40}%`,
                height: "25%",
                opacity: 0.2 + intensityFactor * 0.6,
                boxShadow: `0 0 ${12 + 25 * intensityFactor}px rgba(34, 211, 238, 0.7)`,
              }}
            />
          </div>

          {/* Dose calculations panel */}
          <Card className="mt-4 p-3 bg-muted/70">
            <p className="text-xs">
              <span className="font-semibold">Potência estimada:</span> {results.powerW.toFixed(2)} W
            </p>
            <p className="text-xs">
              <span className="font-semibold">Energia total (sessão 5 min):</span> {results.energyJ.toFixed(1)} J
            </p>
            <p className="text-xs">
              <span className="font-semibold">Dose aproximada:</span> {results.doseJPerCm2.toFixed(1)} J/cm²
            </p>
            <p className="text-xs">
              <span className="font-semibold">Classificação:</span> {results.doseLabel}
            </p>
          </Card>
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
                value={[gainPercent]}
                onValueChange={(value) => setGainPercent(value[0])}
                min={0}
                max={100}
                step={5}
              />
              <p className="text-sm text-right mt-1">{results.intensity.toFixed(2)} W/cm²</p>
            </div>

            <div>
              <Label>Profundidade / Foco</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Ajusta a profundidade de penetração
              </p>
              <Slider
                value={[focusPercent]}
                onValueChange={(value) => setFocusPercent(value[0])}
                min={0}
                max={100}
                step={5}
              />
              <p className="text-sm text-right mt-1">{results.targetDepthCm.toFixed(1)} cm</p>
            </div>

            <div>
              <Label>Frequência (MHz)</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Afeta resolução e penetração
              </p>
              <Slider
                value={[freqPercent]}
                onValueChange={(value) => setFreqPercent(value[0])}
                min={0}
                max={100}
                step={5}
              />
              <p className="text-sm text-right mt-1">{results.frequencyMHz.toFixed(1)} MHz</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Depth bars */}
      <Card className="p-6">
        <h4 className="font-semibold mb-3">Intensidade relativa por profundidade</h4>
        <div className="flex items-end justify-center gap-4 h-32">
          {depths.map((z, idx) => {
            const rel = depthIntensities[idx];
            const height = 20 + rel * 80;
            const opacity = 0.3 + rel * 0.7;
            const isFocused = Math.abs(z - results.targetDepthCm) < 0.8;

            return (
              <div key={z} className="flex flex-col items-center justify-end gap-1">
                <div
                  className={`w-8 rounded-t-md transition-all ${
                    isFocused ? "bg-cyan-400" : "bg-cyan-500"
                  }`}
                  style={{
                    height: `${height}px`,
                    opacity,
                    border: isFocused ? "2px solid rgba(34, 211, 238, 1)" : "none",
                  }}
                />
                <span className="text-[11px] text-muted-foreground font-medium">{z} cm</span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          A intensidade do feixe diminui exponencialmente com a profundidade. Frequências mais altas 
          (próximas a 3 MHz) atenuam mais rapidamente, sendo mais superficiais. Frequências mais baixas 
          (próximas a 1 MHz) penetram mais profundamente. A barra destacada indica a profundidade de foco atual.
        </p>
      </Card>

      {/* Explanation Panel */}
      <Card className="p-6">
        <h4 className="font-semibold mb-3">Explicação dos parâmetros</h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Ganho/Brilho (Intensidade):</strong> Aumenta a energia entregue ao tecido. 
            Maior intensidade resulta em maior dose e aquecimento mais profundo, mas deve ser 
            controlada para evitar desconforto ou lesão térmica.
          </p>
          <p>
            <strong>Frequência (MHz):</strong> Determina a profundidade efetiva do feixe. 
            Frequências mais baixas (~1 MHz) alcançam tecidos mais profundos, enquanto 
            frequências mais altas (~3 MHz) concentram a energia nas camadas superficiais.
          </p>
          <p>
            <strong>Profundidade/Foco:</strong> Ajusta a região de maior concentração de energia. 
            A zona de foco pode ser deslocada para atingir estruturas específicas conforme a 
            necessidade clínica.
          </p>
        </div>
      </Card>
    </div>
  );
};