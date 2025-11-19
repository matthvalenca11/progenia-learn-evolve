import { UltrasoundAnatomyPreset, UltrasoundAnatomyPresetId } from "@/types/ultrasoundPresets";
import { UltrasoundLayerConfig, UltrasoundInclusionConfig } from "@/types/acousticMedia";

/**
 * Enhanced anatomical presets with realistic physics and visual fidelity
 */

export function getDefaultLayersForPreset(presetId: UltrasoundAnatomyPresetId): UltrasoundLayerConfig[] {
  const layersMap: Record<UltrasoundAnatomyPresetId, UltrasoundLayerConfig[]> = {
    // New realistic presets
    msk_tendon_upper_limb: [
      { 
        id: "layer-1", 
        mediumId: "skin", 
        name: "Pele", 
        thicknessCm: 0.2,
        noiseScale: 0.8,
        reflectivityBias: 0.1
      },
      { 
        id: "layer-2", 
        mediumId: "fat", 
        name: "Subcutâneo fino", 
        thicknessCm: 0.3,
        noiseScale: 1.2,
        reflectivityBias: -0.2
      },
      { 
        id: "layer-3", 
        mediumId: "fascia", 
        name: "Camada fascial", 
        thicknessCm: 0.1,
        noiseScale: 0.5,
        reflectivityBias: 0.8
      },
      { 
        id: "layer-4", 
        mediumId: "tendon", 
        name: "Tendão com fibrilas", 
        thicknessCm: 0.7,
        noiseScale: 0.6,
        reflectivityBias: -0.3
      },
      { 
        id: "layer-5", 
        mediumId: "bone_cortical", 
        name: "Interface óssea", 
        thicknessCm: 1.5,
        noiseScale: 0.3,
        reflectivityBias: 0
      },
    ],
    
    muscle_generic: [
      { 
        id: "layer-1", 
        mediumId: "skin", 
        name: "Pele", 
        thicknessCm: 0.3,
        noiseScale: 0.9,
        reflectivityBias: 0.1
      },
      { 
        id: "layer-2", 
        mediumId: "fat", 
        name: "Tecido subcutâneo", 
        thicknessCm: 0.6,
        noiseScale: 1.3,
        reflectivityBias: -0.2
      },
      { 
        id: "layer-3", 
        mediumId: "fascia", 
        name: "Fáscia superficial", 
        thicknessCm: 0.05,
        noiseScale: 0.4,
        reflectivityBias: 0.7
      },
      { 
        id: "layer-4", 
        mediumId: "muscle", 
        name: "Músculo com fibras oblíquas", 
        thicknessCm: 3.5,
        noiseScale: 1.1,
        reflectivityBias: 0
      },
    ],
    
    abdominal_superficial: [
      { 
        id: "layer-1", 
        mediumId: "skin", 
        name: "Pele espessa", 
        thicknessCm: 0.4,
        noiseScale: 0.8,
        reflectivityBias: 0.15
      },
      { 
        id: "layer-2", 
        mediumId: "fat", 
        name: "Tecido subcutâneo heterogêneo", 
        thicknessCm: 1.2,
        noiseScale: 1.5,
        reflectivityBias: -0.3
      },
      { 
        id: "layer-3", 
        mediumId: "fascia", 
        name: "Fáscia abdominal", 
        thicknessCm: 0.1,
        noiseScale: 0.4,
        reflectivityBias: 0.8
      },
      { 
        id: "layer-4", 
        mediumId: "muscle", 
        name: "Músculo reto do abdome", 
        thicknessCm: 1.8,
        noiseScale: 1.0,
        reflectivityBias: 0.1
      },
    ],
    
    vascular_superficial: [
      { 
        id: "layer-1", 
        mediumId: "skin", 
        name: "Pele", 
        thicknessCm: 0.2,
        noiseScale: 0.8,
        reflectivityBias: 0.1
      },
      { 
        id: "layer-2", 
        mediumId: "fat", 
        name: "Subcutâneo", 
        thicknessCm: 0.5,
        noiseScale: 1.2,
        reflectivityBias: -0.2
      },
      { 
        id: "layer-3", 
        mediumId: "muscle", 
        name: "Tecido muscular periférico", 
        thicknessCm: 3.0,
        noiseScale: 1.0,
        reflectivityBias: 0
      },
    ],
    
    tissue_with_inclusions: [
      { 
        id: "layer-1", 
        mediumId: "skin", 
        name: "Pele", 
        thicknessCm: 0.3,
        noiseScale: 0.9,
        reflectivityBias: 0.1
      },
      { 
        id: "layer-2", 
        mediumId: "fat", 
        name: "Gordura", 
        thicknessCm: 0.8,
        noiseScale: 1.3,
        reflectivityBias: -0.2
      },
      { 
        id: "layer-3", 
        mediumId: "muscle", 
        name: "Tecido muscular", 
        thicknessCm: 3.5,
        noiseScale: 1.1,
        reflectivityBias: 0
      },
    ],
    
    // Legacy presets (kept for compatibility)
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

export function getDefaultInclusionsForPreset(presetId: UltrasoundAnatomyPresetId): UltrasoundInclusionConfig[] {
  const inclusionsMap: Record<UltrasoundAnatomyPresetId, UltrasoundInclusionConfig[]> = {
    msk_tendon_upper_limb: [
      {
        id: "incl-microvasc",
        type: "vessel",
        label: "Microvascularização",
        shape: "circle",
        centerDepthCm: 0.4,
        centerLateralPos: 0.3,
        sizeCm: { width: 0.15, height: 0.15 },
        mediumInsideId: "blood",
        hasStrongShadow: false,
        posteriorEnhancement: false,
        borderEchogenicity: "soft",
      },
    ],
    
    vascular_superficial: [
      {
        id: "incl-vein",
        type: "vessel",
        label: "Veia (compressível)",
        shape: "ellipse",
        centerDepthCm: 1.2,
        centerLateralPos: -0.2,
        sizeCm: { width: 0.9, height: 0.6 },
        mediumInsideId: "blood",
        hasStrongShadow: false,
        posteriorEnhancement: true,
        borderEchogenicity: "sharp",
      },
      {
        id: "incl-artery",
        type: "vessel",
        label: "Artéria (pulsátil)",
        shape: "circle",
        centerDepthCm: 1.5,
        centerLateralPos: 0.3,
        sizeCm: { width: 0.6, height: 0.6 },
        mediumInsideId: "blood",
        hasStrongShadow: false,
        posteriorEnhancement: true,
        borderEchogenicity: "sharp",
      },
    ],
    
    tissue_with_inclusions: [
      {
        id: "incl-cyst",
        type: "cyst",
        label: "Cisto anecóico",
        shape: "circle",
        centerDepthCm: 1.8,
        centerLateralPos: -0.4,
        sizeCm: { width: 0.8, height: 0.8 },
        mediumInsideId: "water",
        hasStrongShadow: false,
        posteriorEnhancement: true,
        borderEchogenicity: "sharp",
      },
      {
        id: "incl-lipoma",
        type: "solid_mass",
        label: "Lipoma hipoecóico",
        shape: "ellipse",
        centerDepthCm: 2.2,
        centerLateralPos: 0.4,
        sizeCm: { width: 1.0, height: 0.7 },
        mediumInsideId: "fat",
        hasStrongShadow: false,
        posteriorEnhancement: false,
        borderEchogenicity: "soft",
      },
      {
        id: "incl-nodule",
        type: "solid_mass",
        label: "Nódulo sólido heterogêneo",
        shape: "ellipse",
        centerDepthCm: 1.2,
        centerLateralPos: 0,
        sizeCm: { width: 0.6, height: 0.5 },
        mediumInsideId: "muscle",
        hasStrongShadow: false,
        posteriorEnhancement: false,
        borderEchogenicity: "sharp",
      },
      {
        id: "incl-foreign",
        type: "calcification",
        label: "Corpo estranho hiperecogênico",
        shape: "rectangle",
        centerDepthCm: 2.8,
        centerLateralPos: -0.2,
        sizeCm: { width: 0.4, height: 0.2 },
        mediumInsideId: "bone_cortical",
        hasStrongShadow: true,
        posteriorEnhancement: false,
        borderEchogenicity: "sharp",
      },
    ],
    
    abdominal_superficial: [
      {
        id: "incl-linea-alba",
        type: "heterogeneous_lesion",
        label: "Linha alba",
        shape: "rectangle",
        centerDepthCm: 2.3,
        centerLateralPos: 0,
        sizeCm: { width: 0.3, height: 1.5 },
        mediumInsideId: "fascia",
        hasStrongShadow: false,
        posteriorEnhancement: true,
        borderEchogenicity: "sharp",
      },
    ],
    
    // Legacy presets
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
        posteriorEnhancement: true,
        borderEchogenicity: "sharp",
      },
      {
        id: "incl-2",
        type: "vessel",
        label: "Veia jugular interna",
        shape: "ellipse",
        centerDepthCm: 1.2,
        centerLateralPos: 0.3,
        sizeCm: { width: 1.0, height: 0.8 },
        mediumInsideId: "blood",
        hasStrongShadow: false,
        posteriorEnhancement: true,
        borderEchogenicity: "soft",
      },
    ],
    achilles_tendon_long: [
      {
        id: "incl-1",
        type: "bone_surface",
        label: "Interface óssea do calcâneo",
        shape: "rectangle",
        centerDepthCm: 1.8,
        centerLateralPos: 0,
        sizeCm: { width: 2.0, height: 0.3 },
        mediumInsideId: "bone_cortical",
        hasStrongShadow: true,
        posteriorEnhancement: false,
        borderEchogenicity: "sharp",
      },
    ],
    
    // Default empty for others
    shoulder_supraspinatus_long: [],
    shoulder_biceps_long: [],
    quadriceps_muscle: [],
    lumbar_paravertebral: [],
    generic_muscle: [],
    muscle_generic: [],
  };
  
  return inclusionsMap[presetId] || [];
}

export const ULTRASOUND_PRESETS: Record<UltrasoundAnatomyPresetId, UltrasoundAnatomyPreset> = {
  // New realistic presets
  msk_tendon_upper_limb: {
    id: "msk_tendon_upper_limb",
    label: "MSK - Tendão Membro Superior",
    shortDescription: "Tendão com fibrilas paralelas e anisotropia",
    clinicalTagline: "Ideal para ensino de textura tendinosa e artefatos anisotrópicos",
    transducerType: "linear",
    recommendedFrequencyMHz: 12,
    recommendedDepthCm: 3,
    recommendedFocusCm: 1.5,
    recommendedGain: 55,
    tissueProfile: "tendon",
    vesselCount: 1,
    hasBoneInterface: true,
    hasStrongShadow: false,
    speckleIntensity: 0.6,
  },
  
  muscle_generic: {
    id: "muscle_generic",
    label: "Músculo Genérico",
    shortDescription: "Fibras oblíquas com textura pennate",
    clinicalTagline: "Padrão muscular com septos intermusculares hiperecogênicos",
    transducerType: "linear",
    recommendedFrequencyMHz: 10,
    recommendedDepthCm: 4,
    recommendedFocusCm: 2.5,
    recommendedGain: 50,
    tissueProfile: "muscle",
    vesselCount: 0,
    hasBoneInterface: false,
    hasStrongShadow: false,
    speckleIntensity: 0.8,
  },
  
  abdominal_superficial: {
    id: "abdominal_superficial",
    label: "Região Abdominal Superficial",
    shortDescription: "Parede abdominal com linha alba",
    clinicalTagline: "Músculos reto do abdome e estruturas fasciais",
    transducerType: "linear",
    recommendedFrequencyMHz: 8,
    recommendedDepthCm: 4,
    recommendedFocusCm: 2.5,
    recommendedGain: 52,
    tissueProfile: "muscle",
    vesselCount: 0,
    hasBoneInterface: false,
    hasStrongShadow: false,
    speckleIntensity: 0.9,
  },
  
  vascular_superficial: {
    id: "vascular_superficial",
    label: "Vascular Superficial",
    shortDescription: "Artéria e veia com fluxo Doppler",
    clinicalTagline: "Cross-section vascular com pulsação e compressibilidade",
    transducerType: "linear",
    recommendedFrequencyMHz: 9,
    recommendedDepthCm: 3,
    recommendedFocusCm: 1.5,
    recommendedGain: 48,
    tissueProfile: "vascular",
    vesselCount: 2,
    hasBoneInterface: false,
    hasStrongShadow: false,
    speckleIntensity: 0.7,
  },
  
  tissue_with_inclusions: {
    id: "tissue_with_inclusions",
    label: "Tecido com Inclusões",
    shortDescription: "Múltiplas inclusões para treino de física",
    clinicalTagline: "Cisto, lipoma, nódulo e corpo estranho",
    transducerType: "linear",
    recommendedFrequencyMHz: 10,
    recommendedDepthCm: 4,
    recommendedFocusCm: 2.0,
    recommendedGain: 50,
    tissueProfile: "muscle",
    vesselCount: 0,
    hasBoneInterface: false,
    hasStrongShadow: true,
    speckleIntensity: 0.8,
  },
  
  // Legacy presets
  shoulder_supraspinatus_long: {
    id: "shoulder_supraspinatus_long",
    label: "Ombro - Supraespinal Longitudinal",
    shortDescription: "Tendão do supraespinal em eixo longo",
    clinicalTagline: "View de rotator cuff com interface óssea",
    transducerType: "linear",
    recommendedFrequencyMHz: 12,
    recommendedDepthCm: 4,
    recommendedFocusCm: 2,
    recommendedGain: 55,
    tissueProfile: "tendon",
    hasBoneInterface: true,
    hasStrongShadow: true,
    speckleIntensity: 0.7,
  },
  
  shoulder_biceps_long: {
    id: "shoulder_biceps_long",
    label: "Ombro - Bíceps Longitudinal",
    shortDescription: "Tendão da cabeça longa do bíceps",
    clinicalTagline: "Sulco intertubercular com sombra óssea",
    transducerType: "linear",
    recommendedFrequencyMHz: 12,
    recommendedDepthCm: 3,
    recommendedFocusCm: 1.5,
    recommendedGain: 54,
    tissueProfile: "tendon",
    hasBoneInterface: true,
    hasStrongShadow: true,
    speckleIntensity: 0.7,
  },
  
  carotid_long: {
    id: "carotid_long",
    label: "Carótida - Longitudinal",
    shortDescription: "Artéria carótida comum em eixo longo",
    clinicalTagline: "Vaso com fluxo laminar e parede ecogênica",
    transducerType: "linear",
    recommendedFrequencyMHz: 9,
    recommendedDepthCm: 4,
    recommendedFocusCm: 2,
    recommendedGain: 50,
    tissueProfile: "vascular",
    vesselCount: 1,
    hasStrongShadow: false,
    speckleIntensity: 0.6,
  },
  
  carotid_trans: {
    id: "carotid_trans",
    label: "Carótida - Transversal",
    shortDescription: "Carótida e jugular em cross-section",
    clinicalTagline: "Anatomia vascular cervical com compressibilidade",
    transducerType: "linear",
    recommendedFrequencyMHz: 9,
    recommendedDepthCm: 4,
    recommendedFocusCm: 2,
    recommendedGain: 50,
    tissueProfile: "vascular",
    vesselCount: 2,
    hasStrongShadow: false,
    speckleIntensity: 0.6,
  },
  
  quadriceps_muscle: {
    id: "quadriceps_muscle",
    label: "Quadríceps - Músculo",
    shortDescription: "Músculo quadríceps femoral",
    clinicalTagline: "Músculo volumoso com interface óssea profunda",
    transducerType: "linear",
    recommendedFrequencyMHz: 10,
    recommendedDepthCm: 5,
    recommendedFocusCm: 2.5,
    recommendedGain: 52,
    tissueProfile: "muscle",
    hasBoneInterface: true,
    hasStrongShadow: true,
    speckleIntensity: 0.8,
  },
  
  achilles_tendon_long: {
    id: "achilles_tendon_long",
    label: "Aquiles - Longitudinal",
    shortDescription: "Tendão de Aquiles em eixo longo",
    clinicalTagline: "Tendão espesso com inserção no calcâneo",
    transducerType: "linear",
    recommendedFrequencyMHz: 12,
    recommendedDepthCm: 3,
    recommendedFocusCm: 1.5,
    recommendedGain: 54,
    tissueProfile: "tendon",
    hasBoneInterface: true,
    hasStrongShadow: true,
    speckleIntensity: 0.7,
  },
  
  lumbar_paravertebral: {
    id: "lumbar_paravertebral",
    label: "Lombar - Paravertebral",
    shortDescription: "Musculatura paravertebral lombar",
    clinicalTagline: "Músculos profundos com sombra vertebral",
    transducerType: "convex",
    recommendedFrequencyMHz: 5,
    recommendedDepthCm: 6,
    recommendedFocusCm: 3.5,
    recommendedGain: 55,
    tissueProfile: "muscle",
    hasBoneInterface: true,
    hasStrongShadow: true,
    speckleIntensity: 0.9,
  },
  
  generic_muscle: {
    id: "generic_muscle",
    label: "Músculo Genérico",
    shortDescription: "Padrão muscular simples",
    clinicalTagline: "Baseline para exploração de parâmetros",
    transducerType: "linear",
    recommendedFrequencyMHz: 10,
    recommendedDepthCm: 4,
    recommendedFocusCm: 2,
    recommendedGain: 50,
    tissueProfile: "muscle",
    speckleIntensity: 0.8,
  },
};

export function getPresetById(id: UltrasoundAnatomyPresetId): UltrasoundAnatomyPreset {
  return ULTRASOUND_PRESETS[id];
}

export function getAllPresets(): UltrasoundAnatomyPreset[] {
  return Object.values(ULTRASOUND_PRESETS);
}

export function getPresetsByTransducer(type: "linear" | "convex"): UltrasoundAnatomyPreset[] {
  return Object.values(ULTRASOUND_PRESETS).filter(p => p.transducerType === type);
}
