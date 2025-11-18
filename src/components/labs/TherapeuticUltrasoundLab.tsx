import { useState, useMemo } from "react";
import { LabLayout } from "./LabLayout";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type FrequencyType = "1" | "3";
type ModeType = "continuous" | "pulsed";

export function TherapeuticUltrasoundLab() {
  const [frequency, setFrequency] = useState<FrequencyType>("1");
  const [intensity, setIntensity] = useState(1.5); // W/cm²
  const [era, setEra] = useState(5); // cm²
  const [mode, setMode] = useState<ModeType>("continuous");
  const [dutyCycle, setDutyCycle] = useState(50); // %
  const [duration, setDuration] = useState(10); // minutes

  const calculations = useMemo(() => {
    // Power
    const power = intensity * era;

    // Duty factor
    const duty = mode === "continuous" ? 1.0 : dutyCycle / 100;

    // Energy delivered
    const timeSeconds = duration * 60;
    const energy = power * timeSeconds * duty;

    // Dose (energy per unit area)
    const dose = intensity * timeSeconds * duty;

    // Classification
    let classification = "";
    if (dose < 5) classification = "Dose baixa - efeitos não-térmicos";
    else if (dose < 20) classification = "Dose moderada - efeitos térmicos leves";
    else classification = "Dose alta - efeitos térmicos intensos";

    return {
      power: power.toFixed(2),
      energy: energy.toFixed(1),
      dose: dose.toFixed(1),
      classification,
    };
  }, [intensity, era, mode, dutyCycle, duration]);

  const renderTissuePenetration = () => {
    const mu = frequency === "1" ? 0.35 : 1.0; // Attenuation coefficient
    const depths = [1, 2, 3, 4, 5]; // cm
    
    return (
      <div className="space-y-4">
        {/* Tissue Layers */}
        <div className="relative h-48 rounded-lg overflow-hidden border border-border">
          {/* Probe */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-muted-foreground/20 rounded-b-lg border-x border-b border-border">
            <div className="text-[10px] text-center mt-1 font-medium">Transdutor</div>
          </div>

          {/* Tissue layers */}
          <div className="absolute top-8 inset-x-0 h-12 bg-amber-100/30 border-y border-amber-200/50">
            <span className="text-[10px] ml-2 mt-1 inline-block text-amber-900/60">Pele</span>
          </div>
          <div className="absolute top-20 inset-x-0 h-16 bg-yellow-100/30 border-b border-yellow-200/50">
            <span className="text-[10px] ml-2 mt-1 inline-block text-yellow-900/60">Subcutâneo</span>
          </div>
          <div className="absolute top-36 inset-x-0 bottom-0 bg-red-100/20">
            <span className="text-[10px] ml-2 mt-1 inline-block text-red-900/60">Músculo</span>
          </div>

          {/* Wavefronts */}
          {[0, 1, 2, 3, 4].map((i) => {
            const depth = 6 + i * 36;
            const opacity = Math.exp(-mu * i * 1.2);
            return (
              <div
                key={i}
                className="absolute left-1/2 -translate-x-1/2 h-[2px] bg-primary animate-pulse"
                style={{
                  top: `${depth}px`,
                  width: `${60 + i * 10}%`,
                  opacity: opacity,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1.5s",
                }}
              />
            );
          })}
        </div>

        {/* Intensity at depth */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Intensidade Relativa por Profundidade</h4>
          <div className="space-y-2">
            {depths.map((depth) => {
              const relativeIntensity = Math.exp(-mu * depth);
              const percentage = relativeIntensity * 100;
              
              return (
                <div key={depth} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-12">{depth} cm:</span>
                  <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono w-12">{percentage.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {frequency === "1"
              ? "1 MHz: Penetração profunda (μ = 0.35 cm⁻¹)"
              : "3 MHz: Penetração superficial (μ = 1.0 cm⁻¹)"}
          </p>
        </div>
      </div>
    );
  };

  const controls = (
    <>
      <div className="space-y-3">
        <Label>Frequência</Label>
        <RadioGroup value={frequency} onValueChange={(v) => setFrequency(v as FrequencyType)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="freq-1" />
            <Label htmlFor="freq-1" className="cursor-pointer font-normal">1 MHz (penetração profunda)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3" id="freq-3" />
            <Label htmlFor="freq-3" className="cursor-pointer font-normal">3 MHz (penetração superficial)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <Label>Intensidade (W/cm²)</Label>
          <span className="text-sm font-medium">{intensity.toFixed(1)} W/cm²</span>
        </div>
        <Slider
          value={[intensity]}
          onValueChange={([v]) => setIntensity(v)}
          min={0.1}
          max={2.5}
          step={0.1}
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <Label>ERA (cm²)</Label>
          <span className="text-sm font-medium">{era} cm²</span>
        </div>
        <Slider
          value={[era]}
          onValueChange={([v]) => setEra(v)}
          min={3}
          max={10}
          step={0.5}
        />
      </div>

      <div className="space-y-3">
        <Label>Modo</Label>
        <RadioGroup value={mode} onValueChange={(v) => setMode(v as ModeType)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="continuous" id="mode-cont" />
            <Label htmlFor="mode-cont" className="cursor-pointer font-normal">Contínuo</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pulsed" id="mode-pulsed" />
            <Label htmlFor="mode-pulsed" className="cursor-pointer font-normal">Pulsado</Label>
          </div>
        </RadioGroup>
      </div>

      {mode === "pulsed" && (
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Ciclo de Trabalho (%)</Label>
            <span className="text-sm font-medium">{dutyCycle}%</span>
          </div>
          <Slider
            value={[dutyCycle]}
            onValueChange={([v]) => setDutyCycle(v)}
            min={10}
            max={100}
            step={5}
          />
        </div>
      )}

      <div className="space-y-3">
        <div className="flex justify-between">
          <Label>Duração (min)</Label>
          <span className="text-sm font-medium">{duration} min</span>
        </div>
        <Slider
          value={[duration]}
          onValueChange={([v]) => setDuration(v)}
          min={1}
          max={20}
          step={1}
        />
      </div>
    </>
  );

  const visualization = (
    <div className="space-y-6">
      {/* Tissue Penetration Visualization */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Penetração Tecidual</h3>
        {renderTissuePenetration()}
      </div>

      {/* Results */}
      <Card className="bg-muted/30 p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Potência:</span>
          <span className="font-mono font-bold">{calculations.power} W</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Energia Total:</span>
          <span className="font-mono font-bold">{calculations.energy} J</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Dose:</span>
          <span className="font-mono font-bold text-primary">{calculations.dose} J/cm²</span>
        </div>
        <div className="pt-2 border-t border-border">
          <p className="text-sm font-medium">{calculations.classification}</p>
        </div>
      </Card>

      {/* Explanation */}
      <div className="text-xs text-muted-foreground space-y-2">
        <p>
          <strong>Potência:</strong> P = intensidade × ERA
        </p>
        <p>
          <strong>Energia:</strong> E = P × tempo × fator de trabalho
        </p>
        <p>
          <strong>Atenuação:</strong> I(z) = I₀ × e^(-μz) onde μ depende da frequência
        </p>
      </div>
    </div>
  );

  return (
    <LabLayout
      title="Ultrassom Terapêutico"
      description="Explore penetração tecidual, densidade de energia e efeitos térmicos vs não-térmicos"
      controls={controls}
      visualization={visualization}
    />
  );
}
