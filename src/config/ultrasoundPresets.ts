import { UltrasoundAnatomyPreset, UltrasoundAnatomyPresetId } from "@/types/ultrasoundPresets";
import { UltrasoundLayerConfig, UltrasoundInclusionConfig } from "@/types/acousticMedia";

export function getDefaultLayersForPreset(presetId: UltrasoundAnatomyPresetId): UltrasoundLayerConfig[] {
  return [
    { id: "layer-1", mediumId: "skin" as const, name: "Pele", thicknessCm: 0.3 },
    { id: "layer-2", mediumId: "fat" as const, name: "Gordura", thicknessCm: 0.5 },
    { id: "layer-3", mediumId: "muscle" as const, name: "Músculo", thicknessCm: 3.0 },
  ];
}

export function getDefaultInclusionsForPreset(presetId: UltrasoundAnatomyPresetId): UltrasoundInclusionConfig[] {
  return [];
}

const createPreset = (id: UltrasoundAnatomyPresetId, label: string, type: "linear" | "convex" = "linear"): UltrasoundAnatomyPreset => ({
  id, label, shortDescription: label, clinicalTagline: label,
  transducerType: type, recommendedFrequencyMHz: 10, recommendedDepthCm: 4,
  recommendedFocusCm: 2, recommendedGain: 50, tissueProfile: "muscle",
});

export const ULTRASOUND_PRESETS: Record<UltrasoundAnatomyPresetId, UltrasoundAnatomyPreset> = {
  msk_tendon_upper_limb: createPreset("msk_tendon_upper_limb", "MSK - Tendão", "linear"),
  muscle_generic: createPreset("muscle_generic", "Músculo Genérico"),
  abdominal_superficial: createPreset("abdominal_superficial", "Abdominal"),
  vascular_superficial: createPreset("vascular_superficial", "Vascular"),
  tissue_with_inclusions: createPreset("tissue_with_inclusions", "Com Inclusões"),
  shoulder_supraspinatus_long: createPreset("shoulder_supraspinatus_long", "Ombro"),
  shoulder_biceps_long: createPreset("shoulder_biceps_long", "Bíceps"),
  carotid_long: createPreset("carotid_long", "Carótida Long"),
  carotid_trans: createPreset("carotid_trans", "Carótida Trans"),
  quadriceps_muscle: createPreset("quadriceps_muscle", "Quadríceps"),
  achilles_tendon_long: createPreset("achilles_tendon_long", "Aquiles"),
  lumbar_paravertebral: createPreset("lumbar_paravertebral", "Lombar", "convex"),
  generic_muscle: createPreset("generic_muscle", "Genérico"),
};

export const getPresetById = (id: UltrasoundAnatomyPresetId) => ULTRASOUND_PRESETS[id];
export const getAllPresets = () => Object.values(ULTRASOUND_PRESETS);
export const getPresetsByTransducer = (type: "linear" | "convex" | "microconvex") => 
  Object.values(ULTRASOUND_PRESETS).filter(p => p.transducerType === type);
