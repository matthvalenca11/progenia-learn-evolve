import { useState, useMemo } from "react";
import { LabLayout } from "./LabLayout";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

type WaveformType = "monophasic" | "biphasic_symmetric" | "biphasic_asymmetric" | "russian";

export function ElectrotherapyDoseLab() {
  const [current, setCurrent] = useState(30); // mA
  const [pulseWidth, setPulseWidth] = useState(200); // µs
  const [frequency, setFrequency] = useState(50); // Hz
  const [duration, setDuration] = useState(15); // minutes
  const [waveform, setWaveform] = useState<WaveformType>("biphasic_symmetric");

  const calculations = useMemo(() => {
    // Convert units
    const currentAmps = current / 1000; // mA to A
    let pulseWidthSeconds = pulseWidth / 1_000_000; // µs to s

    // Russian stimulation uses effective pulse width
    if (waveform === "russian") {
      pulseWidthSeconds = 1 / 2500; // 2500 Hz carrier frequency
    }

    // Charge per pulse (mC)
    const chargePerPulse = (currentAmps * pulseWidthSeconds) * 1000;

    // Total pulses in session
    const durationSeconds = duration * 60;
    const totalPulses = frequency * durationSeconds;

    // Total charge (mC)
    const totalCharge = chargePerPulse * totalPulses;

    // Classification
    let classification = "";
    if (totalCharge < 100) classification = "Dose baixa - efeitos sensoriais";
    else if (totalCharge < 300) classification = "Dose moderada - contração muscular leve";
    else if (totalCharge < 600) classification = "Dose alta - contração muscular forte";
    else classification = "Dose muito alta - uso cauteloso";

    return {
      chargePerPulse: chargePerPulse.toFixed(3),
      totalPulses: totalPulses.toFixed(0),
      totalCharge: totalCharge.toFixed(1),
      classification,
    };
  }, [current, pulseWidth, frequency, duration, waveform]);

  const renderPulseTrain = () => {
    const pulseCount = Math.min(50, Math.ceil(frequency / 2)); // Visual representation
    const pulses = Array.from({ length: pulseCount });
    
    const heightScale = current / 120; // Normalize to max current
    const spacing = 100 / pulseCount;

    return (
      <div className="relative h-48 bg-background border border-border rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-end justify-around px-2">
          {pulses.map((_, i) => {
            const height = 30 + heightScale * 140; // 30-170px range
            
            if (waveform === "russian") {
              // Show carrier frequency effect with multiple thin lines
              return (
                <div key={i} className="flex gap-[1px]" style={{ width: `${spacing * 0.8}%` }}>
                  {[0, 1, 2].map((j) => (
                    <div
                      key={j}
                      className="bg-primary/70"
                      style={{
                        height: `${height * (0.8 + Math.random() * 0.4)}px`,
                        width: '2px',
                      }}
                    />
                  ))}
                </div>
              );
            }

            // Regular pulse
            return (
              <div
                key={i}
                className="bg-primary"
                style={{
                  height: `${height}px`,
                  width: `${spacing * 0.4}%`,
                  minWidth: '2px',
                }}
              />
            );
          })}
        </div>
        
        {/* Baseline */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-border" />
      </div>
    );
  };

  const controls = (
    <>
      <div className="space-y-3">
        <div className="flex justify-between">
          <Label>Corrente (mA)</Label>
          <span className="text-sm font-medium">{current} mA</span>
        </div>
        <Slider
          value={[current]}
          onValueChange={([v]) => setCurrent(v)}
          min={1}
          max={120}
          step={1}
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <Label>Largura de Pulso (µs)</Label>
          <span className="text-sm font-medium">{pulseWidth} µs</span>
        </div>
        <Slider
          value={[pulseWidth]}
          onValueChange={([v]) => setPulseWidth(v)}
          min={50}
          max={1000}
          step={10}
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <Label>Frequência (Hz)</Label>
          <span className="text-sm font-medium">{frequency} Hz</span>
        </div>
        <Slider
          value={[frequency]}
          onValueChange={([v]) => setFrequency(v)}
          min={1}
          max={150}
          step={1}
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <Label>Duração (min)</Label>
          <span className="text-sm font-medium">{duration} min</span>
        </div>
        <Slider
          value={[duration]}
          onValueChange={([v]) => setDuration(v)}
          min={1}
          max={60}
          step={1}
        />
      </div>

      <div className="space-y-3">
        <Label>Tipo de Forma de Onda</Label>
        <Select value={waveform} onValueChange={(v) => setWaveform(v as WaveformType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monophasic">Monofásica</SelectItem>
            <SelectItem value="biphasic_symmetric">Bifásica Simétrica</SelectItem>
            <SelectItem value="biphasic_asymmetric">Bifásica Assimétrica</SelectItem>
            <SelectItem value="russian">Corrente Russa (2500 Hz)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  const visualization = (
    <div className="space-y-6">
      {/* Pulse Train Visualization */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Trem de Pulsos</h3>
        {renderPulseTrain()}
        <p className="text-xs text-muted-foreground mt-2">
          {waveform === "russian"
            ? "Corrente Russa: Múltiplas linhas representam a frequência portadora de 2500 Hz modulada em 50 Hz"
            : "Altura = intensidade da corrente; Densidade = frequência"}
        </p>
      </div>

      {/* Results */}
      <Card className="bg-muted/30 p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Carga por Pulso:</span>
          <span className="font-mono font-bold">{calculations.chargePerPulse} mC</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Pulsos Totais:</span>
          <span className="font-mono font-bold">{calculations.totalPulses}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Carga Total:</span>
          <span className="font-mono font-bold text-primary">{calculations.totalCharge} mC</span>
        </div>
        <div className="pt-2 border-t border-border">
          <p className="text-sm font-medium">{calculations.classification}</p>
        </div>
      </Card>

      {/* Explanation */}
      <div className="text-xs text-muted-foreground space-y-2">
        <p>
          <strong>Frequência:</strong> Maior frequência = mais pulsos por segundo = densidade visual aumenta
        </p>
        <p>
          <strong>Carga por Pulso:</strong> Q = I(A) × largura(s) × 1000
        </p>
        <p>
          <strong>Corrente Russa:</strong> Usa largura de pulso efetiva de 1/2500s devido à frequência portadora
        </p>
      </div>
    </div>
  );

  return (
    <LabLayout
      title="Dosagem em Eletroterapia"
      description="Simule parâmetros de estimulação elétrica e calcule a dosagem total com física realista"
      controls={controls}
      visualization={visualization}
    />
  );
}
