import { UltrasoundAnatomyPreset, UltrasoundAnatomyPresetId } from "@/types/ultrasoundPresets";
import { UltrasoundLayerConfig, UltrasoundInclusionConfig } from "@/types/acousticMedia";

/**
 * ANATOMICAL ULTRASOUND PRESETS - SIMPLIFIED & ENHANCED
 * 
 * Focused on 5 clinically important presets with maximum realism
 * Based on peer-reviewed anatomy references and clinical protocols
 * 
 * Key References:
 * 1. Tardioli A, et al. "Tendon Thickness and Depth from Skin" Arch Phys Med Rehabil 2005
 * 2. CARDIA Ultrasound Manual "Carotid Ultrasound Protocol"
 * 3. O'Neill JM "Musculoskeletal Ultrasound: Anatomy and Technique" Springer 2008
 * 4. AJR "Musculoskeletal Sonography Tutorial" 2000
 */

export function getDefaultLayersForPreset(presetId: UltrasoundAnatomyPresetId): UltrasoundLayerConfig[] {
  const layerSets: Record<UltrasoundAnatomyPresetId, UltrasoundLayerConfig[]> = {
    // ===========================
    // TENDÃO SUPERFICIAL - MSK
    // ===========================
    // Estrutura: Pele → Subcutâneo → Paratendão (brilhante) → Tendão fibrilar → Músculo → Osso
    // Tendões aparecem como estruturas fibrilares hiperecogênicas com padrão linear paralelo
    msk_tendon_upper_limb: [
      { id: "skin", mediumId: "skin", name: "Pele", thicknessCm: 0.10, noiseScale: 1.4, reflectivityBias: 0.08 },
      { id: "subcut", mediumId: "fat", name: "Subcutâneo", thicknessCm: 0.15, noiseScale: 0.75, reflectivityBias: -0.15 },
      { id: "paratenon", mediumId: "fascia", name: "Paratendão", thicknessCm: 0.03, noiseScale: 2.2, reflectivityBias: 0.45 },
      { id: "tendon", mediumId: "tendon", name: "Tendão (fibrilar)", thicknessCm: 0.35, noiseScale: 1.9, reflectivityBias: 0.38 },
      { id: "muscle_layer", mediumId: "muscle", name: "Músculo Adjacente", thicknessCm: 1.2, noiseScale: 1.0, reflectivityBias: 0.02 },
      { id: "bone", mediumId: "bone_cortical", name: "Interface Óssea", thicknessCm: 0.3, noiseScale: 0.3, reflectivityBias: 0.60 },
    ],
    
    // ===========================
    // OMBRO - MANGUITO ROTADOR (Supraespinhal - Eixo Longo)
    // ===========================
    // Estrutura: Pele → Subcutâneo → Deltoide (músculo) → Bursa → Tendão supraespinhal → Cartilagem → Úmero
    // Tendão aparece como estrutura fibrilar hiperecogênica entre músculo deltoide e cabeça do úmero
    shoulder_supraspinatus_long: [
      { id: "skin", mediumId: "skin", name: "Pele", thicknessCm: 0.12, noiseScale: 1.3, reflectivityBias: 0.06 },
      { id: "subcut", mediumId: "fat", name: "Subcutâneo", thicknessCm: 0.4, noiseScale: 0.8, reflectivityBias: -0.18 },
      { id: "deltoid", mediumId: "muscle", name: "Músculo Deltoide", thicknessCm: 0.9, noiseScale: 1.05, reflectivityBias: 0.0 },
      { id: "subacromial", mediumId: "water", name: "Bursa Subacromial", thicknessCm: 0.15, noiseScale: 0.4, reflectivityBias: -0.70 },
      { id: "supraspinatus", mediumId: "tendon", name: "Tendão Supraespinhal", thicknessCm: 0.55, noiseScale: 1.8, reflectivityBias: 0.35 },
      { id: "cartilage", mediumId: "cartilage", name: "Cartilagem Articular", thicknessCm: 0.2, noiseScale: 1.3, reflectivityBias: 0.15 },
      { id: "humerus", mediumId: "bone_cortical", name: "Cabeça do Úmero", thicknessCm: 0.4, noiseScale: 0.3, reflectivityBias: 0.65 },
    ],
    
    // ===========================
    // CARÓTIDA COMUM - EIXO LONGO (Vascular)
    // ===========================
    // Estrutura: Pele → Subcutâneo → Músculo platisma → Gordura perivascular → Parede vascular → Lúmen
    // Vaso aparece como estrutura tubular anecóica com parede hiperecogênica fina
    carotid_long: [
      { id: "skin", mediumId: "skin", name: "Pele", thicknessCm: 0.12, noiseScale: 1.3, reflectivityBias: 0.05 },
      { id: "subcut", mediumId: "fat", name: "Tecido Subcutâneo", thicknessCm: 0.45, noiseScale: 0.75, reflectivityBias: -0.14 },
      { id: "platysma", mediumId: "muscle", name: "Músculo Platisma", thicknessCm: 0.25, noiseScale: 1.1, reflectivityBias: 0.0 },
      { id: "perivascular", mediumId: "fat", name: "Gordura Perivascular", thicknessCm: 0.3, noiseScale: 0.7, reflectivityBias: -0.10 },
      { id: "vessel_wall", mediumId: "fascia", name: "Parede da Carótida", thicknessCm: 0.08, noiseScale: 2.5, reflectivityBias: 0.50 },
      { id: "lumen", mediumId: "blood", name: "Lúmen com Sangue", thicknessCm: 0.65, noiseScale: 0.2, reflectivityBias: -0.90 },
      { id: "deep_tissue", mediumId: "generic_soft", name: "Tecidos Profundos", thicknessCm: 1.8, noiseScale: 0.95, reflectivityBias: 0.0 },
    ],
    
    // ===========================
    // CARÓTIDA COMUM - EIXO CURTO/TRANSVERSO (Vascular)
    // ===========================
    // Vista em corte transversal - vaso circular anecóico com parede brilhante
    carotid_trans: [
      { id: "skin", mediumId: "skin", name: "Pele", thicknessCm: 0.12, noiseScale: 1.3, reflectivityBias: 0.05 },
      { id: "subcut", mediumId: "fat", name: "Subcutâneo", thicknessCm: 0.45, noiseScale: 0.75, reflectivityBias: -0.14 },
      { id: "muscle", mediumId: "muscle", name: "Músculo", thicknessCm: 0.8, noiseScale: 1.05, reflectivityBias: 0.0 },
      { id: "vessel_wall", mediumId: "fascia", name: "Parede Vascular", thicknessCm: 0.08, noiseScale: 2.5, reflectivityBias: 0.50 },
      { id: "lumen", mediumId: "blood", name: "Lúmen", thicknessCm: 0.65, noiseScale: 0.2, reflectivityBias: -0.90 },
      { id: "deep", mediumId: "generic_soft", name: "Tecido Profundo", thicknessCm: 1.8, noiseScale: 0.95, reflectivityBias: 0.0 },
    ],
    
    // ===========================
    // MÚSCULO GENÉRICO (Educacional)
    // ===========================
    // Estrutura básica para ensino: Pele → Subcutâneo → Fáscia brilhante → Músculo com fibras → Fáscia profunda
    muscle_generic: [
      { id: "skin", mediumId: "skin", name: "Pele", thicknessCm: 0.13, noiseScale: 1.3, reflectivityBias: 0.05 },
      { id: "subcut", mediumId: "fat", name: "Gordura Subcutânea", thicknessCm: 0.5, noiseScale: 0.8, reflectivityBias: -0.16 },
      { id: "fascia_sup", mediumId: "fascia", name: "Fáscia Superficial", thicknessCm: 0.04, noiseScale: 2.0, reflectivityBias: 0.42 },
      { id: "muscle", mediumId: "muscle", name: "Músculo Esquelético", thicknessCm: 2.2, noiseScale: 1.05, reflectivityBias: 0.03 },
      { id: "fascia_deep", mediumId: "fascia", name: "Fáscia Profunda", thicknessCm: 0.04, noiseScale: 2.0, reflectivityBias: 0.40 },
      { id: "deep", mediumId: "generic_soft", name: "Tecidos Profundos", thicknessCm: 1.2, noiseScale: 0.9, reflectivityBias: 0.0 },
    ],
  };
  
  return layerSets[presetId] || layerSets.muscle_generic;
}

export function getDefaultInclusionsForPreset(presetId: UltrasoundAnatomyPresetId): UltrasoundInclusionConfig[] {
  const inclusionSets: Record<UltrasoundAnatomyPresetId, UltrasoundInclusionConfig[]> = {
    // TENDÃO SUPERFICIAL - sem inclusões patológicas por padrão
    msk_tendon_upper_limb: [],
    
    // OMBRO - MANGUITO ROTADOR - sem patologia por padrão
    shoulder_supraspinatus_long: [],
    
    // CARÓTIDA EIXO LONGO - vaso principal
    carotid_long: [
      {
        id: "carotid_vessel",
        type: "vessel",
        label: "Artéria Carótida Comum",
        shape: "ellipse",
        centerDepthCm: 1.5,
        centerLateralPos: 0,
        sizeCm: { width: 1.8, height: 0.7 },
        mediumInsideId: "blood",
        hasStrongShadow: false,
        posteriorEnhancement: false,
        borderEchogenicity: "sharp",
      },
    ],
    
    // CARÓTIDA TRANSVERSO - vaso em corte
    carotid_trans: [
      {
        id: "carotid_vessel_trans",
        type: "vessel",
        label: "Carótida (Transverso)",
        shape: "circle",
        centerDepthCm: 1.8,
        centerLateralPos: 0,
        sizeCm: { width: 0.7, height: 0.7 },
        mediumInsideId: "blood",
        hasStrongShadow: false,
        posteriorEnhancement: false,
        borderEchogenicity: "sharp",
      },
    ],
    
    // MÚSCULO GENÉRICO - estrutura simples sem inclusões
    muscle_generic: [],
  };
  
  return inclusionSets[presetId] || [];
}

/**
 * ULTRASOUND ANATOMY PRESETS
 * Complete preset definitions with clinically appropriate parameters
 */
export const ULTRASOUND_PRESETS: Record<UltrasoundAnatomyPresetId, UltrasoundAnatomyPreset> = {
  // ===========================
  // 1. TENDÃO SUPERFICIAL MSK
  // ===========================
  msk_tendon_upper_limb: {
    id: "msk_tendon_upper_limb",
    label: "Tendão Superficial - MSK",
    shortDescription: "Tendões extensores/flexores do antebraço e punho",
    clinicalTagline: "Avaliação de tendinopatia, ruptura e tenossinovite em tendões superficiais",
    transducerType: "linear",
    recommendedFrequencyMHz: 12.0,
    recommendedDepthCm: 2.5,
    recommendedFocusCm: 1.0,
    recommendedGain: 55,
    tissueProfile: "tendon",
    vesselCount: 0,
    hasBoneInterface: true,
    hasStrongShadow: true,
    noiseSeed: 101,
    speckleIntensity: 1.1,
    layerBrightness: [0.8, 0.6, 1.4, 1.3, 0.9, 1.6],
  },
  
  // ===========================
  // 2. OMBRO - MANGUITO ROTADOR
  // ===========================
  shoulder_supraspinatus_long: {
    id: "shoulder_supraspinatus_long",
    label: "Ombro - Manguito Rotador",
    shortDescription: "Tendão supraespinhal - eixo longo",
    clinicalTagline: "Diagnóstico de lesões do manguito rotador, tendinopatia e rupturas",
    transducerType: "linear",
    recommendedFrequencyMHz: 10.0,
    recommendedDepthCm: 3.5,
    recommendedFocusCm: 2.2,
    recommendedGain: 50,
    tissueProfile: "tendon",
    vesselCount: 0,
    hasBoneInterface: true,
    hasStrongShadow: true,
    noiseSeed: 202,
    speckleIntensity: 1.0,
    layerBrightness: [0.8, 0.6, 0.9, 0.4, 1.3, 1.1, 1.7],
  },
  
  // ===========================
  // 3. CARÓTIDA - EIXO LONGO
  // ===========================
  carotid_long: {
    id: "carotid_long",
    label: "Carótida Comum - Longitudinal",
    shortDescription: "Artéria carótida comum - eixo longo",
    clinicalTagline: "Avaliação de placas ateroscleróticas, estenose e morfologia vascular",
    transducerType: "linear",
    recommendedFrequencyMHz: 9.0,
    recommendedDepthCm: 4.0,
    recommendedFocusCm: 1.8,
    recommendedGain: 48,
    tissueProfile: "vascular",
    vesselCount: 1,
    hasBoneInterface: false,
    hasStrongShadow: false,
    noiseSeed: 303,
    speckleIntensity: 0.9,
    layerBrightness: [0.8, 0.65, 0.85, 0.7, 1.4, 0.2, 0.95],
  },
  
  // ===========================
  // 4. CARÓTIDA - TRANSVERSO
  // ===========================
  carotid_trans: {
    id: "carotid_trans",
    label: "Carótida Comum - Transversal",
    shortDescription: "Artéria carótida comum - eixo curto",
    clinicalTagline: "Medição do diâmetro vascular, avaliação de estenose e estudo Doppler",
    transducerType: "linear",
    recommendedFrequencyMHz: 9.0,
    recommendedDepthCm: 4.0,
    recommendedFocusCm: 1.8,
    recommendedGain: 48,
    tissueProfile: "vascular",
    vesselCount: 1,
    hasBoneInterface: false,
    hasStrongShadow: false,
    noiseSeed: 404,
    speckleIntensity: 0.9,
    layerBrightness: [0.8, 0.65, 0.9, 1.4, 0.2, 0.95],
  },
  
  // ===========================
  // 5. MÚSCULO GENÉRICO
  // ===========================
  muscle_generic: {
    id: "muscle_generic",
    label: "Músculo Genérico",
    shortDescription: "Estrutura muscular básica para ensino",
    clinicalTagline: "Identificação de camadas teciduais, fascias e padrão muscular normal",
    transducerType: "linear",
    recommendedFrequencyMHz: 10.0,
    recommendedDepthCm: 4.5,
    recommendedFocusCm: 2.5,
    recommendedGain: 52,
    tissueProfile: "muscle",
    vesselCount: 0,
    hasBoneInterface: false,
    hasStrongShadow: false,
    noiseSeed: 505,
    speckleIntensity: 1.0,
    layerBrightness: [0.8, 0.7, 1.3, 0.95, 1.3, 0.9],
  },
};

/**
 * Utility functions
 */
export function getPresetById(id: UltrasoundAnatomyPresetId): UltrasoundAnatomyPreset {
  return ULTRASOUND_PRESETS[id];
}

export function getAllPresets(): UltrasoundAnatomyPreset[] {
  return Object.values(ULTRASOUND_PRESETS);
}

export function getPresetsByTransducer(type: "linear" | "convex" | "microconvex"): UltrasoundAnatomyPreset[] {
  return Object.values(ULTRASOUND_PRESETS).filter(preset => preset.transducerType === type);
}
