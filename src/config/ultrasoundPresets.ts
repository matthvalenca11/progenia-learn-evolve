import { UltrasoundAnatomyPreset, UltrasoundAnatomyPresetId } from "@/types/ultrasoundPresets";
import { UltrasoundLayerConfig, UltrasoundInclusionConfig } from "@/types/acousticMedia";

/**
 * Get default layers for a preset
 */
export function getDefaultLayersForPreset(presetId: UltrasoundAnatomyPresetId): UltrasoundLayerConfig[] {
  const layersMap: Record<UltrasoundAnatomyPresetId, UltrasoundLayerConfig[]> = {
    shoulder_supraspinatus_long: [
      { id: "layer-1", mediumId: "skin", name: "Pele", thicknessCm: 0.3 },
      { id: "layer-2", mediumId: "fat", name: "Gordura subcutânea", thicknessCm: 0.5 },
      { id: "layer-3", mediumId: "tendon", name: "Tendão supraespinal", thicknessCm: 0.6 },
      { id: "layer-4", mediumId: "bone_cortical", name: "Cabeça do úmero", thicknessCm: 2.0 },
    ],
    shoulder_biceps_long: [
      { id: "layer-1", mediumId: "skin", name: "Pele", thicknessCm: 0.3 },
      { id: "layer-2", mediumId: "fat", name: "Gordura subcutânea", thicknessCm: 0.4 },
      { id: "layer-3", mediumId: "tendon", name: "Tendão do bíceps", thicknessCm: 0.5 },
      { id: "layer-4", mediumId: "bone_cortical", name: "Sulco intertubercular", thicknessCm: 1.8 },
    ],
    carotid_long: [
      { id: "layer-1", mediumId: "skin", name: "Pele", thicknessCm: 0.2 },
      { id: "layer-2", mediumId: "fat", name: "Gordura subcutânea", thicknessCm: 0.5 },
      { id: "layer-3", mediumId: "muscle", name: "Músculo esternocleidomastóideo", thicknessCm: 2.8 },
    ],
    carotid_trans: [
      { id: "layer-1", mediumId: "skin", name: "Pele", thicknessCm: 0.2 },
      { id: "layer-2", mediumId: "fat", name: "Gordura subcutânea", thicknessCm: 0.5 },
      { id: "layer-3", mediumId: "muscle", name: "Músculo esternocleidomastóideo", thicknessCm: 2.8 },
    ],
    quadriceps_muscle: [
      { id: "layer-1", mediumId: "skin", name: "Pele", thicknessCm: 0.3 },
      { id: "layer-2", mediumId: "fat", name: "Gordura subcutânea", thicknessCm: 0.7 },
      { id: "layer-3", mediumId: "muscle", name: "Músculo quadríceps", thicknessCm: 3.0 },
      { id: "layer-4", mediumId: "bone_cortical", name: "Fêmur", thicknessCm: 0.5 },
    ],
    achilles_tendon_long: [
      { id: "layer-1", mediumId: "skin", name: "Pele", thicknessCm: 0.2 },
      { id: "layer-2", mediumId: "fat", name: "Gordura subcutânea", thicknessCm: 0.3 },
      { id: "layer-3", mediumId: "tendon", name: "Tendão de Aquiles", thicknessCm: 0.6 },
      { id: "layer-4", mediumId: "bone_cortical", name: "Calcâneo", thicknessCm: 1.4 },
    ],
    lumbar_paravertebral: [
      { id: "layer-1", mediumId: "skin", name: "Pele", thicknessCm: 0.3 },
      { id: "layer-2", mediumId: "fat", name: "Gordura subcutânea", thicknessCm: 1.0 },
      { id: "layer-3", mediumId: "muscle", name: "Músculo paravertebral", thicknessCm: 3.5 },
      { id: "layer-4", mediumId: "bone_cortical", name: "Vértebra", thicknessCm: 0.7 },
    ],
    generic_muscle: [
      { id: "layer-1", mediumId: "skin", name: "Pele", thicknessCm: 0.3 },
      { id: "layer-2", mediumId: "fat", name: "Gordura", thicknessCm: 0.5 },
      { id: "layer-3", mediumId: "muscle", name: "Músculo", thicknessCm: 3.0 },
    ],
  };
  
  return layersMap[presetId] || layersMap.generic_muscle;
}

/**
 * Get default inclusions for a preset
 */
export function getDefaultInclusionsForPreset(presetId: UltrasoundAnatomyPresetId): UltrasoundInclusionConfig[] {
  const inclusionsMap: Record<UltrasoundAnatomyPresetId, UltrasoundInclusionConfig[]> = {
    carotid_long: [
      {
        id: "incl-1",
        type: "vessel",
        label: "Artéria carótida comum",
        shape: "ellipse",
        centerDepthCm: 1.5,
        centerLateralPos: 0,
        sizeCm: { width: 0.8, height: 0.6 },
        mediumInsideId: "blood",
        hasStrongShadow: false,
        posteriorEnhancement: true,
        borderEchogenicity: "sharp",
      },
    ],
    carotid_trans: [
      {
        id: "incl-1",
        type: "vessel",
        label: "Artéria carótida comum",
        shape: "circle",
        centerDepthCm: 1.5,
        centerLateralPos: -0.2,
        sizeCm: { width: 0.7, height: 0.7 },
        mediumInsideId: "blood",
        hasStrongShadow: false,
        posteriorEnhancement: false,
        borderEchogenicity: "sharp",
      },
      {
        id: "incl-2",
        type: "vessel",
        label: "Veia jugular interna",
        shape: "circle",
        centerDepthCm: 1.2,
        centerLateralPos: 0.3,
        sizeCm: { width: 1.0, height: 1.0 },
        mediumInsideId: "blood",
        hasStrongShadow: false,
        posteriorEnhancement: false,
        borderEchogenicity: "soft",
      },
    ],
    achilles_tendon_long: [
      {
        id: "incl-1",
        type: "bone_surface",
        label: "Superfície do calcâneo",
        shape: "rectangle",
        centerDepthCm: 2.0,
        centerLateralPos: 0,
        sizeCm: { width: 2.0, height: 0.3 },
        mediumInsideId: "bone_cortical",
        hasStrongShadow: true,
        posteriorEnhancement: false,
        borderEchogenicity: "sharp",
      },
    ],
    quadriceps_muscle: [
      {
        id: "incl-1",
        type: "bone_surface",
        label: "Superfície do fêmur",
        shape: "rectangle",
        centerDepthCm: 4.0,
        centerLateralPos: 0,
        sizeCm: { width: 3.0, height: 0.2 },
        mediumInsideId: "bone_cortical",
        hasStrongShadow: true,
        posteriorEnhancement: false,
        borderEchogenicity: "sharp",
      },
    ],
    shoulder_supraspinatus_long: [],
    shoulder_biceps_long: [],
    lumbar_paravertebral: [],
    generic_muscle: [],
  };
  
  return inclusionsMap[presetId] || [];
}

/**
 * Real clinical ultrasound anatomy presets
 * Each preset represents a realistic clinical view with appropriate parameters
 */
export const ULTRASOUND_PRESETS: Record<UltrasoundAnatomyPresetId, UltrasoundAnatomyPreset> = {
  shoulder_supraspinatus_long: {
    id: "shoulder_supraspinatus_long",
    label: "Ombro – Supraespinal (Long.)",
    shortDescription: "Vista longitudinal do tendão supraespinal",
    clinicalTagline: "Tendão supraespinal sobre a cabeça do úmero – longitudinal",
    transducerType: "linear",
    recommendedFrequencyMHz: 12,
    recommendedDepthCm: 3.5,
    recommendedFocusCm: 1.8,
    recommendedGain: 55,
    tissueProfile: "tendon",
    hasBoneInterface: true,
    hasStrongShadow: true,
    noiseSeed: 101,
    speckleIntensity: 0.7,
    layerBrightness: [0.3, 0.9, 0.2],
  },

  shoulder_biceps_long: {
    id: "shoulder_biceps_long",
    label: "Ombro – Bíceps (Long.)",
    shortDescription: "Vista longitudinal do tendão da cabeça longa do bíceps",
    clinicalTagline: "Tendão do bíceps no sulco intertubercular – longitudinal",
    transducerType: "linear",
    recommendedFrequencyMHz: 10,
    recommendedDepthCm: 3.0,
    recommendedFocusCm: 1.5,
    recommendedGain: 50,
    tissueProfile: "tendon",
    hasBoneInterface: true,
    hasStrongShadow: false,
    noiseSeed: 102,
    speckleIntensity: 0.8,
    layerBrightness: [0.25, 0.85, 0.3],
  },

  carotid_long: {
    id: "carotid_long",
    label: "Carótida (Longitudinal)",
    shortDescription: "Artéria carótida comum – corte longitudinal",
    clinicalTagline: "Carótida comum – vista longitudinal com fluxo",
    transducerType: "linear",
    recommendedFrequencyMHz: 9,
    recommendedDepthCm: 3.5,
    recommendedFocusCm: 2.0,
    recommendedGain: 45,
    tissueProfile: "vascular",
    vesselCount: 1,
    hasBoneInterface: false,
    hasStrongShadow: false,
    noiseSeed: 201,
    speckleIntensity: 0.5,
    layerBrightness: [0.4, 0.1, 0.6],
  },

  carotid_trans: {
    id: "carotid_trans",
    label: "Carótida (Transversal)",
    shortDescription: "Artéria carótida comum – corte transversal",
    clinicalTagline: "Carótida comum e jugular interna – vista transversal",
    transducerType: "linear",
    recommendedFrequencyMHz: 9,
    recommendedDepthCm: 3.5,
    recommendedFocusCm: 2.0,
    recommendedGain: 45,
    tissueProfile: "vascular",
    vesselCount: 2,
    hasBoneInterface: false,
    hasStrongShadow: false,
    noiseSeed: 202,
    speckleIntensity: 0.5,
    layerBrightness: [0.4, 0.1, 0.6],
  },

  quadriceps_muscle: {
    id: "quadriceps_muscle",
    label: "Quadríceps (Músculo)",
    shortDescription: "Músculo quadriceps femoral",
    clinicalTagline: "Quadríceps – fibras musculares paralelas",
    transducerType: "linear",
    recommendedFrequencyMHz: 10,
    recommendedDepthCm: 4.5,
    recommendedFocusCm: 2.5,
    recommendedGain: 52,
    tissueProfile: "muscle",
    hasBoneInterface: true,
    hasStrongShadow: false,
    noiseSeed: 301,
    speckleIntensity: 0.65,
    layerBrightness: [0.35, 0.6, 0.2],
  },

  achilles_tendon_long: {
    id: "achilles_tendon_long",
    label: "Tendão de Aquiles (Long.)",
    shortDescription: "Tendão de Aquiles – vista longitudinal",
    clinicalTagline: "Tendão de Aquiles sobre o calcâneo – longitudinal",
    transducerType: "linear",
    recommendedFrequencyMHz: 15,
    recommendedDepthCm: 2.5,
    recommendedFocusCm: 1.2,
    recommendedGain: 58,
    tissueProfile: "tendon",
    hasBoneInterface: true,
    hasStrongShadow: true,
    noiseSeed: 401,
    speckleIntensity: 0.75,
    layerBrightness: [0.2, 0.95, 0.15],
  },

  lumbar_paravertebral: {
    id: "lumbar_paravertebral",
    label: "Paravertebral Lombar",
    shortDescription: "Musculatura paravertebral lombar",
    clinicalTagline: "Músculos paravertebrais lombares – tecido profundo",
    transducerType: "convex",
    recommendedFrequencyMHz: 4,
    recommendedDepthCm: 7.0,
    recommendedFocusCm: 4.0,
    recommendedGain: 48,
    tissueProfile: "muscle",
    hasBoneInterface: true,
    hasStrongShadow: true,
    noiseSeed: 501,
    speckleIntensity: 0.6,
    layerBrightness: [0.4, 0.5, 0.3],
  },

  generic_muscle: {
    id: "generic_muscle",
    label: "Músculo Genérico",
    shortDescription: "Padrão muscular genérico para demonstração",
    clinicalTagline: "Vista muscular genérica – fibras paralelas",
    transducerType: "linear",
    recommendedFrequencyMHz: 10,
    recommendedDepthCm: 4.0,
    recommendedFocusCm: 2.0,
    recommendedGain: 50,
    tissueProfile: "muscle",
    hasBoneInterface: false,
    hasStrongShadow: false,
    noiseSeed: 999,
    speckleIntensity: 0.6,
    layerBrightness: [0.3, 0.6, 0.4],
  },
};

/**
 * Get preset by ID
 */
export function getPresetById(id: UltrasoundAnatomyPresetId): UltrasoundAnatomyPreset {
  return ULTRASOUND_PRESETS[id];
}

/**
 * Get all presets as array
 */
export function getAllPresets(): UltrasoundAnatomyPreset[] {
  return Object.values(ULTRASOUND_PRESETS);
}

/**
 * Get presets by transducer type
 */
export function getPresetsByTransducer(type: "linear" | "convex" | "phased"): UltrasoundAnatomyPreset[] {
  return getAllPresets().filter(preset => preset.transducerType === type);
}
