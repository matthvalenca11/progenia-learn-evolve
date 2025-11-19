import { useMemo, useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useUltrasoundImageEngine } from "@/hooks/useUltrasoundImageEngine";
import { UltrasoundLabConfig, DEFAULT_ULTRASOUND_CONFIG } from "@/types/ultrasound";

interface UltrasoundSimulatorProps {
  config?: UltrasoundLabConfig;
  title?: string;
  description?: string;
}

export const UltrasoundSimulator = ({
  config = DEFAULT_ULTRASOUND_CONFIG,
  title,
  description,
}: UltrasoundSimulatorProps) => {
  // Use config or defaults
  const { showGain, showDepth, showFrequency, showFocus } = config;

  // Slider states (0-100 for UI)
  const [gainPercent, setGainPercent] = useState(50);
  const [depthPercent, setDepthPercent] = useState(50);
  const [freqPercent, setFreqPercent] = useState(40);
  const [focusPercent, setFocusPercent] = useState(40);

  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 640, height: 480 });

  // Map slider values to physical parameters
  const physicalParams = useMemo(() => {
    const intensity = 0.1 + (gainPercent / 100) * 2.4; // 0.1-2.5 W/cm²
    const depthCm = 2 + (depthPercent / 100) * 8; // 2-10 cm
    const frequencyMHz = 2 + (freqPercent / 100) * 13; // 2-15 MHz
    const focusCm = 1 + (focusPercent / 100) * (depthCm - 1); // 1 to depth

    const eraCm2 = 5;
    const timeSec = 300; // 5 min reference
    const powerW = intensity * eraCm2;
    const energyJ = powerW * timeSec;
    const doseJPerCm2 = intensity * timeSec;

    let doseLabel = "Dose baixa (< 5 J/cm²)";
    if (doseJPerCm2 >= 5 && doseJPerCm2 <= 20) doseLabel = "Dose moderada (5–20 J/cm²)";
    if (doseJPerCm2 > 20) doseLabel = "Dose alta (> 20 J/cm²)";

    return {
      intensity,
      depthCm,
      frequencyMHz,
      focusCm,
      powerW,
      energyJ,
      doseJPerCm2,
      doseLabel,
    };
  }, [gainPercent, depthPercent, freqPercent, focusPercent]);

  // Use defaults if control is hidden
  const effectiveGain = showGain ? gainPercent : 50;
  const effectiveDepth = showDepth ? physicalParams.depthCm : 6;
  const effectiveFreq = showFrequency ? physicalParams.frequencyMHz : 7.5;
  const effectiveFocus = showFocus ? physicalParams.focusCm : effectiveDepth / 2;

  // Render ultrasound image
  useUltrasoundImageEngine(
    canvasRef,
    {
      gain: effectiveGain,
      depth: effectiveDepth,
      frequency: effectiveFreq,
      focus: effectiveFocus,
      width: canvasSize.width,
      height: canvasSize.height,
      time: 0,
    },
    true
  );

  // Resize canvas to fit container
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current?.parentElement) {
        const rect = canvasRef.current.parentElement.getBoundingClientRect();
        setCanvasSize({
          width: Math.floor(rect.width),
          height: Math.floor(rect.height),
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Beam animation params
  const beamWidth = 30 + (1 - freqPercent / 100) * 40;
  const waveDuration = 2.5 - (freqPercent / 100) * 1;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">
          {title || "Simulador de Parâmetros de Ultrassom"}
        </h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      <div className="grid lg:grid-cols-[2fr,1fr] gap-6">
        {/* LEFT: Ultrasound Console View */}
        <div className="space-y-4">
          {/* Main ultrasound screen */}
          <Card className="bg-slate-950 border-slate-800 p-4">
            <div className="relative bg-slate-900/50 rounded-lg overflow-hidden border border-slate-700">
              {/* Probe head */}
              <div
                className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
                style={{ width: "120px" }}
              >
                <div className="w-3 h-3 bg-slate-300 rounded-full" />
                <div className="w-20 h-6 bg-gradient-to-b from-slate-200 to-slate-300 rounded-b-2xl shadow-lg flex items-center justify-center text-[9px] font-semibold text-slate-800">
                  PROBE
                </div>
              </div>

              {/* Scan field container with animated beams overlay */}
              <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
                {/* Canvas for ultrasound image */}
                <canvas
                  ref={canvasRef}
                  width={canvasSize.width}
                  height={canvasSize.height}
                  className="absolute inset-0 w-full h-full"
                  style={{ imageRendering: "pixelated" }}
                />

                {/* Animated beam overlays */}
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none rounded-b-full opacity-0"
                    style={{
                      width: `${beamWidth + i * 30}%`,
                      height: "140%",
                      border: "1.5px solid rgba(56, 189, 248, 0.25)",
                      boxShadow: `0 0 ${10 + i * 5}px rgba(56, 189, 248, 0.4)`,
                      animation: `ultraWave ${waveDuration}s ease-in-out infinite`,
                      animationDelay: `${i * (waveDuration / 3)}s`,
                    }}
                  />
                ))}

                {/* Focus indicator line (if focus control is shown) */}
                {showFocus && (
                  <div
                    className="absolute right-2 w-4 h-0.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 transition-all duration-300"
                    style={{
                      top: `${(effectiveFocus / effectiveDepth) * 100}%`,
                    }}
                  >
                    <div className="absolute -right-1 -top-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  </div>
                )}

                {/* Depth scale on right edge */}
                <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-400 py-2">
                  {Array.from({ length: 6 }).map((_, i) => {
                    const d = (effectiveDepth / 5) * i;
                    return (
                      <div key={i} className="flex items-center gap-1">
                        <div className="w-2 h-px bg-slate-600" />
                        <span>{d.toFixed(1)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status bar at bottom */}
              <div className="mt-2 px-3 py-2 bg-slate-900/80 rounded flex items-center justify-between text-[10px] text-slate-300 border-t border-slate-700/50">
                <span>Profundidade: {effectiveDepth.toFixed(1)} cm</span>
                <span>Freq: {effectiveFreq.toFixed(1)} MHz</span>
                <span>Ganho: {((effectiveGain - 50) * 0.6).toFixed(0)} dB</span>
              </div>
            </div>
          </Card>

          {/* Results panel */}
          <Card className="p-4 bg-slate-50 dark:bg-slate-900">
            <h4 className="text-sm font-semibold mb-3">Cálculos Estimados</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Potência:</span>
                <span className="ml-2 font-medium">{physicalParams.powerW.toFixed(2)} W</span>
              </div>
              <div>
                <span className="text-muted-foreground">Energia (5 min):</span>
                <span className="ml-2 font-medium">{physicalParams.energyJ.toFixed(0)} J</span>
              </div>
              <div>
                <span className="text-muted-foreground">Dose:</span>
                <span className="ml-2 font-medium">
                  {physicalParams.doseJPerCm2.toFixed(1)} J/cm²
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Classificação:</span>
                <span className="ml-2 font-medium">{physicalParams.doseLabel}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT: Controls Panel */}
        <div className="space-y-4">
          <Card className="p-5 bg-slate-50 dark:bg-slate-900">
            <h4 className="text-base font-semibold mb-4">Controles do Transdutor</h4>

            <div className="space-y-6">
              {/* Gain control */}
              {showGain && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label className="text-sm font-medium">Ganho / Brilho</Label>
                      <p className="text-xs text-muted-foreground">Amplificação do sinal</p>
                    </div>
                    <span className="text-xs font-mono bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">
                      {physicalParams.intensity.toFixed(2)} W/cm²
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[gainPercent]}
                    onValueChange={([v]) => setGainPercent(v)}
                    className="py-2"
                  />
                </div>
              )}

              {/* Depth control */}
              {showDepth && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label className="text-sm font-medium">Profundidade</Label>
                      <p className="text-xs text-muted-foreground">Alcance do escaneamento</p>
                    </div>
                    <span className="text-xs font-mono bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">
                      {physicalParams.depthCm.toFixed(1)} cm
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[depthPercent]}
                    onValueChange={([v]) => setDepthPercent(v)}
                    className="py-2"
                  />
                </div>
              )}

              {/* Frequency control */}
              {showFrequency && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label className="text-sm font-medium">Frequência</Label>
                      <p className="text-xs text-muted-foreground">Resolução vs penetração</p>
                    </div>
                    <span className="text-xs font-mono bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">
                      {physicalParams.frequencyMHz.toFixed(1)} MHz
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[freqPercent]}
                    onValueChange={([v]) => setFreqPercent(v)}
                    className="py-2"
                  />
                </div>
              )}

              {/* Focus control */}
              {showFocus && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label className="text-sm font-medium">Foco</Label>
                      <p className="text-xs text-muted-foreground">Zona de maior nitidez</p>
                    </div>
                    <span className="text-xs font-mono bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">
                      {physicalParams.focusCm.toFixed(1)} cm
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[focusPercent]}
                    onValueChange={([v]) => setFocusPercent(v)}
                    className="py-2"
                  />
                </div>
              )}
            </div>
          </Card>

          <p className="text-xs text-muted-foreground px-2">
            Este simulador é um modelo didático simplificado para fins educacionais. Não substitui
            protocolos clínicos reais.
          </p>
        </div>
      </div>
    </div>
  );
};
