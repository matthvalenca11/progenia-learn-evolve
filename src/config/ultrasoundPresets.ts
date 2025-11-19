import { UltrasoundAnatomyPreset, UltrasoundAnatomyPresetId } from "@/types/ultrasoundPresets";
import { UltrasoundLayerConfig, UltrasoundInclusionConfig } from "@/types/acousticMedia";

/**
 * ANATOMICAL ULTRASOUND PRESETS
 * Based on clinical ultrasound anatomy references and peer-reviewed measurements
 * 
 * Key References:
 * 1. Tardioli A, et al. "Tendon Thickness and Depth from Skin" Arch Phys Med Rehabil 2005
 *    https://www.sciencedirect.com/science/article/abs/pii/S0031940605600302
 * 
 * 2. Alabau-Dasi R, et al. "Achilles Tendon Assessment" Diagnostics 2024
 *    Normal Achilles thickness: 4-6mm AP, depth from skin: 5-8mm
 *    https://riuma.uma.es/xmlui/bitstream/handle/10630/38387/diagnostics-14-02221.pdf
 * 
 * 3. CARDIA Ultrasound Manual "Carotid Ultrasound Protocol"
 *    Carotid depth: 15-25mm from skin, diameter: 6-8mm
 *    https://www.cardia.dopm.uab.edu/images/more/pdf/mooy20/Y20%20Ultrasound%20Manual.pdf
 * 
 * 4. Thieme Connect "Rectus Abdominis Thickness" Arch Plast Surg 2012
 *    Muscle thickness: 8-12mm, subcutaneous fat: 5-25mm (variable)
 *    https://www.thieme-connect.de/products/ejournals/abstract/10.5999/aps.2012.39.5.528
 * 
 * 5. O'Neill JM "Musculoskeletal Ultrasound: Anatomy and Technique" Springer 2008
 *    Comprehensive MSK anatomy atlas
 * 
 * 6. AJR "Musculoskeletal Sonography Tutorial" 2000
 *    https://ajronline.org/doi/10.2214/ajr.175.3.1750637
 */

export function getDefaultLayersForPreset(presetId: UltrasoundAnatomyPresetId): UltrasoundLayerConfig[] {
  const layerSets: Record<UltrasoundAnatomyPresetId, UltrasoundLayerConfig[]> = {
    // SHOULDER - SUPRASPINATUS (Long axis)
    shoulder_supraspinatus_long: [
      { id: "skin", mediumId: "skin", name: "Pele", thicknessCm: 0.15, noiseScale: 1.2, reflectivityBias: 0.05 },
      { id: "subcut", mediumId: "fat", name: "Subcutâneo", thicknessCm: 0.5, noiseScale: 0.8, reflectivityBias: -0.15 },
      { id: "deltoid", mediumId: "muscle", name: "Deltoide", thicknessCm: 1.0, noiseScale: 1.0, reflectivityBias: 0.0 },
      { id: "supraspinatus", mediumId: "tendon", name: "Tendão Supraespinhal", thicknessCm: 0.6, noiseScale: 1.5, reflectivityBias: 0.25 },
      { id: "bone", mediumId: "bone_cortical", name: "Úmero", thicknessCm: 0.3, noiseScale: 0.5, reflectivityBias: 0.5 },
    ],
    
    // SHOULDER - BICEPS (Long axis)
    shoulder_biceps_long: [
      { id: "skin", mediumId: "skin", name: "Pele", thicknessCm: 0.12, noiseScale: 1.3, reflectivityBias: 0.05 },
      { id: "subcut", mediumId: "fat", name: "Subcutâneo", thicknessCm: 0.3, noiseScale: 0.9, reflectivityBias: -0.12 },
      { id: "biceps_tendon", mediumId: "tendon", name: "Tendão do Bíceps", thicknessCm: 0.45, noiseScale: 1.6, reflectivityBias: 0.28 },
      { id: "groove", mediumId: "cartilage", name: "Sulco Intertubercular", thicknessCm: 0.6, noiseScale: 1.1, reflectivityBias: 0.15 },
      { id: "humerus", mediumId: "bone_cortical", name: "Úmero", thicknessCm: 0.4, noiseScale: 0.5, reflectivityBias: 0.52 },
    ],
    
    // ACHILLES TENDON (Long axis) - Ref: Normal thickness 4-6mm, depth 5-8mm
    achilles_tendon_long: [
      { id: "skin", mediumId: "skin", name: "Pele", thicknessCm: 0.2, noiseScale: 1.2, reflectivityBias: 0.05 },
      { id: "subcut", mediumId: "fat", name: "Subcutâneo", thicknessCm: 0.3, noiseScale: 0.9, reflectivityBias: -0.1 },
      { id: "paratenon", mediumId: "fascia", name: "Paratendão", thicknessCm: 0.1, noiseScale: 1.8, reflectivityBias: 0.35 },
      { id: "achilles", mediumId: "tendon", name: "Tendão de Aquiles", thicknessCm: 0.5, noiseScale: 1.6, reflectivityBias: 0.20 },
      { id: "kager", mediumId: "fat", name: "Gordura de Kager", thicknessCm: 0.8, noiseScale: 0.7, reflectivityBias: -0.20 },
      { id: "calcaneus", mediumId: "bone_cortical", name: "Calcâneo", thicknessCm: 0.4, noiseScale: 0.4, reflectivityBias: 0.55 },
    ],
    
    // CAROTID ARTERY (Long axis) - Ref: Depth 15-25mm, diameter 6-8mm
    carotid_long: [
      { id: "skin", mediumId: "skin", name: "Pele", thicknessCm: 0.15, noiseScale: 1.2, reflectivityBias: 0.05 },
      { id: "subcut", mediumId: "fat", name: "Subcutâneo", thicknessCm: 0.5, noiseScale: 0.8, reflectivityBias: -0.12 },
      { id: "platysma", mediumId: "muscle", name: "Platisma", thicknessCm: 0.2, noiseScale: 1.1, reflectivityBias: 0.0 },
      { id: "scm", mediumId: "muscle", name: "Esternocleidomastoideo", thicknessCm: 0.8, noiseScale: 1.0, reflectivityBias: 0.05 },
      { id: "adventitia", mediumId: "fascia", name: "Parede Vascular", thicknessCm: 0.05, noiseScale: 2.0, reflectivityBias: 0.40 },
      { id: "lumen", mediumId: "blood", name: "Luz da Carótida", thicknessCm: 0.7, noiseScale: 0.3, reflectivityBias: -0.85 },
      { id: "deep", mediumId: "generic_soft", name: "Tecidos Profundos", thicknessCm: 1.5, noiseScale: 0.9, reflectivityBias: 0.0 },
    ],
    
    // CAROTID (Transverse)
    carotid_trans: [
      { id: "skin", mediumId: "skin", name: "Pele", thicknessCm: 0.15, noiseScale: 1.2, reflectivityBias: 0.05 },
      { id: "subcut", mediumId: "fat", name: "Subcutâneo", thicknessCm: 0.5, noiseScale: 0.8, reflectivityBias: -0.12 },
      { id: "muscle", mediumId: "muscle", name: "Músculo", thicknessCm: 1.0, noiseScale: 1.0, reflectivityBias: 0.0 },
      { id: "vessel_wall", mediumId: "fascia", name: "Parede", thicknessCm: 0.05, noiseScale: 2.0, reflectivityBias: 0.42 },
      { id: "lumen", mediumId: "blood", name: "Lúmen", thicknessCm: 0.7, noiseScale: 0.3, reflectivityBias: -0.85 },
      { id: "deep", mediumId: "generic_soft", name: "Profundo", thicknessCm: 1.5, noiseScale: 0.9, reflectivityBias: 0.0 },
    ],
    
    // QUADRICEPS MUSCLE - Ref: Thickness varies, ~20mm rectus femoris
    quadriceps_muscle: [
      { id: "skin", mediumId: "skin", name: "Pele", thicknessCm: 0.15, noiseScale: 1.2, reflectivityBias: 0.05 },
      { id: "subcut", mediumId: "fat", name: "Subcutâneo", thicknessCm: 0.8, noiseScale: 0.8, reflectivityBias: -0.15 },
      { id: "fascia", mediumId: "fascia", name: "Fáscia", thicknessCm: 0.05, noiseScale: 1.9, reflectivityBias: 0.38 },
      { id: "rectus", mediumId: "muscle", name: "Reto Femoral", thicknessCm: 2.0, noiseScale: 1.0, reflectivityBias: 0.05 },
      { id: "vastus", mediumId: "muscle", name: "Vasto Intermédio", thicknessCm: 1.5, noiseScale: 1.1, reflectivityBias: 0.0 },
      { id: "femur", mediumId: "bone_cortical", name: "Fêmur", thicknessCm: 0.4, noiseScale: 0.5, reflectivityBias: 0.52 },
    ],
    
    // LUMBAR PARAVERTEBRAL - Deeper structure, needs convex probe
    lumbar_paravertebral: [
      { id: "skin", mediumId: "skin", name: "Pele", thicknessCm: 0.2, noiseScale: 1.2, reflectivityBias: 0.05 },
      { id: "subcut", mediumId: "fat", name: "Subcutâneo", thicknessCm: 1.5, noiseScale: 0.7, reflectivityBias: -0.18 },
      { id: "fascia", mediumId: "fascia", name: "Fáscia Toracolombar", thicknessCm: 0.1, noiseScale: 2.0, reflectivityBias: 0.42 },
      { id: "erector", mediumId: "muscle", name: "Eretor da Espinha", thicknessCm: 2.5, noiseScale: 1.0, reflectivityBias: 0.08 },
      { id: "multifidus", mediumId: "muscle", name: "Multífido", thicknessCm: 1.8, noiseScale: 1.1, reflectivityBias: 0.05 },
      { id: "vertebra", mediumId: "bone_cortical", name: "Processo Transverso", thicknessCm: 0.5, noiseScale: 0.4, reflectivityBias: 0.58 },
    ],
    
    // RECTUS ABDOMINIS - Ref: Muscle 8-12mm, subcutaneous fat 5-25mm
    abdominal_superficial: [
      { id: "skin", mediumId: "skin", name: "Pele", thicknessCm: 0.15, noiseScale: 1.2, reflectivityBias: 0.05 },
      { id: "subcut", mediumId: "fat", name: "Gordura Subcutânea", thicknessCm: 1.2, noiseScale: 0.75, reflectivityBias: -0.20 },
      { id: "fascia", mediumId: "fascia", name: "Fáscia", thicknessCm: 0.05, noiseScale: 1.9, reflectivityBias: 0.38 },
      { id: "rectus", mediumId: "muscle", name: "Reto do Abdome", thicknessCm: 1.0, noiseScale: 1.0, reflectivityBias: 0.05 },
      { id: "linea", mediumId: "fascia", name: "Linha Alba", thicknessCm: 0.15, noiseScale: 2.1, reflectivityBias: 0.45 },
      { id: "peritoneum", mediumId: "generic_soft", name: "Peritônio/Vísceras", thicknessCm: 1.5, noiseScale: 0.85, reflectivityBias: -0.05 },
    ],
    
    // MSK TENDON - UPPER LIMB (superficial tendons)
    msk_tendon_upper_limb: [
      { id: "skin", mediumId: "skin", name: "Pele", thicknessCm: 0.12, noiseScale: 1.3, reflectivityBias: 0.05 },
      { id: "subcut", mediumId: "fat", name: "Subcutâneo", thicknessCm: 0.2, noiseScale: 0.9, reflectivityBias: -0.10 },
      { id: "paratenon", mediumId: "fascia", name: "Paratendão", thicknessCm: 0.05, noiseScale: 2.0, reflectivityBias: 0.40 },
      { id: "tendon", mediumId: "tendon", name: "Tendão", thicknessCm: 0.4, noiseScale: 1.7, reflectivityBias: 0.30 },
      { id: "muscle", mediumId: "muscle", name: "Músculo", thicknessCm: 1.5, noiseScale: 1.0, reflectivityBias: 0.0 },
      { id: "bone", mediumId: "bone_cortical", name: "Osso", thicknessCm: 0.3, noiseScale: 0.5, reflectivityBias: 0.50 },
    ],
    
    // GENERIC MUSCLE (teaching basic ultrasound)
    muscle_generic: [
      { id: "skin", mediumId: "skin", name: "Pele", thicknessCm: 0.15, noiseScale: 1.2, reflectivityBias: 0.05 },
      { id: "subcut", mediumId: "fat", name: "Subcutâneo", thicknessCm: 0.6, noiseScale: 0.8, reflectivityBias: -0.15 },
      { id: "fascia", mediumId: "fascia", name: "Fáscia", thicknessCm: 0.05, noiseScale: 1.9, reflectivityBias: 0.38 },
      { id: "muscle", mediumId: "muscle", name: "Músculo", thicknessCm: 2.5, noiseScale: 1.0, reflectivityBias: 0.05 },
      { id: "bone", mediumId: "bone_cortical", name: "Osso", thicknessCm: 0.4, noiseScale: 0.5, reflectivityBias: 0.52 },
    ],
    
    // VASCULAR - Superficial vessels for Doppler
    vascular_superficial: [
      { id: "skin", mediumId: "skin", name: "Pele", thicknessCm: 0.15, noiseScale: 1.2, reflectivityBias: 0.05 },
      { id: "subcut", mediumId: "fat", name: "Subcutâneo", thicknessCm: 0.5, noiseScale: 0.8, reflectivityBias: -0.12 },
      { id: "fascia", mediumId: "fascia", name: "Fáscia", thicknessCm: 0.05, noiseScale: 1.9, reflectivityBias: 0.35 },
      { id: "muscle", mediumId: "muscle", name: "Músculo", thicknessCm: 1.5, noiseScale: 1.0, reflectivityBias: 0.0 },
      { id: "vessel_wall", mediumId: "fascia", name: "Parede Vascular", thicknessCm: 0.05, noiseScale: 2.0, reflectivityBias: 0.40 },
      { id: "lumen", mediumId: "blood", name: "Luz Vascular", thicknessCm: 0.6, noiseScale: 0.3, reflectivityBias: -0.80 },
      { id: "deep_muscle", mediumId: "muscle", name: "Músculo Profundo", thicknessCm: 1.5, noiseScale: 1.0, reflectivityBias: 0.0 },
    ],
    
    // TISSUE WITH INCLUSIONS (for teaching physics and pathology)
    tissue_with_inclusions: [
      { id: "skin", mediumId: "skin", name: "Pele", thicknessCm: 0.15, noiseScale: 1.2, reflectivityBias: 0.05 },
      { id: "subcut", mediumId: "fat", name: "Subcutâneo", thicknessCm: 0.8, noiseScale: 0.8, reflectivityBias: -0.15 },
      { id: "muscle_upper", mediumId: "muscle", name: "Músculo Superficial", thicknessCm: 1.5, noiseScale: 1.0, reflectivityBias: 0.05 },
      { id: "muscle_deep", mediumId: "muscle", name: "Músculo Profundo", thicknessCm: 2.0, noiseScale: 1.0, reflectivityBias: 0.0 },
      { id: "bone", mediumId: "bone_cortical", name: "Osso", thicknessCm: 0.5, noiseScale: 0.5, reflectivityBias: 0.52 },
    ],
    
    // GENERIC MUSCLE (alias for compatibility)
    generic_muscle: [
      { id: "skin", mediumId: "skin", name: "Pele", thicknessCm: 0.15, noiseScale: 1.2, reflectivityBias: 0.05 },
      { id: "subcut", mediumId: "fat", name: "Subcutâneo", thicknessCm: 0.6, noiseScale: 0.8, reflectivityBias: -0.15 },
      { id: "fascia", mediumId: "fascia", name: "Fáscia", thicknessCm: 0.05, noiseScale: 1.9, reflectivityBias: 0.38 },
      { id: "muscle", mediumId: "muscle", name: "Músculo", thicknessCm: 2.5, noiseScale: 1.0, reflectivityBias: 0.05 },
      { id: "bone", mediumId: "bone_cortical", name: "Osso", thicknessCm: 0.4, noiseScale: 0.5, reflectivityBias: 0.52 },
    ],
  };
  
  return layerSets[presetId] || layerSets.generic_muscle;
}

export function getDefaultInclusionsForPreset(presetId: UltrasoundAnatomyPresetId): UltrasoundInclusionConfig[] {
  const inclusionSets: Record<UltrasoundAnatomyPresetId, UltrasoundInclusionConfig[]> = {
    // Carotid has vessel structure
    carotid_long: [
      {
        id: "carotid_vessel",
        type: "vessel",
        label: "Artéria Carótida Comum",
        shape: "ellipse",
        centerDepthCm: 2.0,
        centerLateralPos: 0,
        sizeCm: { width: 0.7, height: 0.7 },
        mediumInsideId: "blood",
        hasStrongShadow: false,
        posteriorEnhancement: true,
        borderEchogenicity: "sharp",
      },
    ],
    
    carotid_trans: [
      {
        id: "carotid_circle",
        type: "vessel",
        label: "Carótida (corte transversal)",
        shape: "circle",
        centerDepthCm: 2.0,
        centerLateralPos: 0,
        sizeCm: { width: 0.7, height: 0.7 },
        mediumInsideId: "blood",
        hasStrongShadow: false,
        posteriorEnhancement: true,
        borderEchogenicity: "sharp",
      },
    ],
    
    // Vascular preset has vessel
    vascular_superficial: [
      {
        id: "superficial_vessel",
        type: "vessel",
        label: "Vaso Superficial",
        shape: "ellipse",
        centerDepthCm: 2.2,
        centerLateralPos: 0,
        sizeCm: { width: 0.6, height: 0.6 },
        mediumInsideId: "blood",
        hasStrongShadow: false,
        posteriorEnhancement: true,
        borderEchogenicity: "sharp",
      },
    ],
    
    // Tissue with inclusions - multiple pathology examples
    tissue_with_inclusions: [
      {
        id: "cyst",
        type: "cyst",
        label: "Cisto Simples",
        shape: "circle",
        centerDepthCm: 1.5,
        centerLateralPos: -0.15,
        sizeCm: { width: 0.8, height: 0.8 },
        mediumInsideId: "water",
        hasStrongShadow: false,
        posteriorEnhancement: true,
        borderEchogenicity: "sharp",
      },
      {
        id: "lipoma",
        type: "solid_mass",
        label: "Lipoma",
        shape: "ellipse",
        centerDepthCm: 2.5,
        centerLateralPos: 0.2,
        sizeCm: { width: 1.0, height: 0.6 },
        mediumInsideId: "fat",
        hasStrongShadow: false,
        posteriorEnhancement: false,
        borderEchogenicity: "soft",
      },
      {
        id: "foreign_body",
        type: "calcification",
        label: "Corpo Estranho",
        shape: "rectangle",
        centerDepthCm: 1.2,
        centerLateralPos: 0.15,
        sizeCm: { width: 0.3, height: 0.15 },
        mediumInsideId: "bone_cortical",
        hasStrongShadow: true,
        posteriorEnhancement: false,
        borderEchogenicity: "sharp",
      },
    ],
    
    // Default: no inclusions for other presets
    shoulder_supraspinatus_long: [],
    shoulder_biceps_long: [],
    achilles_tendon_long: [],
    quadriceps_muscle: [],
    lumbar_paravertebral: [],
    abdominal_superficial: [],
    msk_tendon_upper_limb: [],
    muscle_generic: [],
    generic_muscle: [],
  };
  
  return inclusionSets[presetId] || [];
}

/**
 * ULTRASOUND ANATOMY PRESETS
 * Complete preset definitions with clinically appropriate parameters
 */
export const ULTRASOUND_PRESETS: Record<UltrasoundAnatomyPresetId, UltrasoundAnatomyPreset> = {
  // SUPERFICIAL MSK - Linear high-frequency
  msk_tendon_upper_limb: {
    id: "msk_tendon_upper_limb",
    label: "MSK - Tendão Membro Superior",
    shortDescription: "Tendões extensores/flexores superficiais",
    clinicalTagline: "Avaliação de tendinopatia em antebraço e punho",
    transducerType: "linear",
    recommendedFrequencyMHz: 12.0,
    recommendedDepthCm: 2.5,
    recommendedFocusCm: 1.2,
    recommendedGain: 55,
    tissueProfile: "tendon",
    vesselCount: 0,
    hasBoneInterface: true,
    layerBrightness: [0.8, 0.6, 1.2, 0.9, 1.5],
  },
  
  shoulder_supraspinatus_long: {
    id: "shoulder_supraspinatus_long",
    label: "Ombro - Supraespinhal (Eixo Longo)",
    shortDescription: "Tendão do manguito rotador",
    clinicalTagline: "Diagnóstico de lesões do manguito rotador",
    transducerType: "linear",
    recommendedFrequencyMHz: 10.0,
    recommendedDepthCm: 3.5,
    recommendedFocusCm: 2.0,
    recommendedGain: 50,
    tissueProfile: "tendon",
    vesselCount: 0,
    hasBoneInterface: true,
    layerBrightness: [0.8, 0.6, 0.9, 1.3, 1.6],
  },
  
  shoulder_biceps_long: {
    id: "shoulder_biceps_long",
    label: "Ombro - Bíceps (Eixo Longo)",
    shortDescription: "Tendão longo do bíceps no sulco",
    clinicalTagline: "Tendinite bicipital e instabilidade",
    transducerType: "linear",
    recommendedFrequencyMHz: 10.0,
    recommendedDepthCm: 3.0,
    recommendedFocusCm: 1.5,
    recommendedGain: 52,
    tissueProfile: "tendon",
    vesselCount: 0,
    hasBoneInterface: true,
    layerBrightness: [0.8, 0.7, 1.3, 1.0, 1.5],
  },
  
  achilles_tendon_long: {
    id: "achilles_tendon_long",
    label: "Tendão de Aquiles (Eixo Longo)",
    shortDescription: "Avaliação do tendão calcâneo",
    clinicalTagline: "Tendinopatia de Aquiles e rupturas",
    transducerType: "linear",
    recommendedFrequencyMHz: 12.0,
    recommendedDepthCm: 2.5,
    recommendedFocusCm: 1.2,
    recommendedGain: 54,
    tissueProfile: "tendon",
    vesselCount: 0,
    hasBoneInterface: true,
    layerBrightness: [0.8, 0.65, 1.4, 1.2, 0.7, 1.6],
  },
  
  // MUSCLE STRUCTURES
  quadriceps_muscle: {
    id: "quadriceps_muscle",
    label: "Músculo Quadríceps",
    shortDescription: "Arquitetura muscular da coxa anterior",
    clinicalTagline: "Avaliação de lesões musculares e atrofia",
    transducerType: "linear",
    recommendedFrequencyMHz: 8.0,
    recommendedDepthCm: 5.0,
    recommendedFocusCm: 2.5,
    recommendedGain: 48,
    tissueProfile: "muscle",
    vesselCount: 0,
    hasBoneInterface: true,
    layerBrightness: [0.8, 0.65, 1.3, 0.95, 0.9, 1.5],
  },
  
  muscle_generic: {
    id: "muscle_generic",
    label: "Músculo Genérico",
    shortDescription: "Estrutura muscular básica para ensino",
    clinicalTagline: "Introdução à ultrassonografia musculoesquelética",
    transducerType: "linear",
    recommendedFrequencyMHz: 10.0,
    recommendedDepthCm: 4.0,
    recommendedFocusCm: 2.0,
    recommendedGain: 50,
    tissueProfile: "muscle",
    vesselCount: 0,
    hasBoneInterface: true,
    layerBrightness: [0.8, 0.65, 1.3, 0.95, 1.5],
  },
  
  generic_muscle: {
    id: "generic_muscle",
    label: "Genérico (Músculo)",
    shortDescription: "Vista muscular padrão",
    clinicalTagline: "Ensino básico de ultrassom",
    transducerType: "linear",
    recommendedFrequencyMHz: 10.0,
    recommendedDepthCm: 4.0,
    recommendedFocusCm: 2.0,
    recommendedGain: 50,
    tissueProfile: "muscle",
    vesselCount: 0,
    hasBoneInterface: true,
    layerBrightness: [0.8, 0.65, 1.3, 0.95, 1.5],
  },
  
  // DEEP STRUCTURES - Convex probe
  lumbar_paravertebral: {
    id: "lumbar_paravertebral",
    label: "Lombar - Paravertebrais",
    shortDescription: "Músculos profundos da coluna lombar",
    clinicalTagline: "Avaliação de atrofia muscular e dor lombar",
    transducerType: "convex",
    recommendedFrequencyMHz: 3.5,
    recommendedDepthCm: 7.0,
    recommendedFocusCm: 4.0,
    recommendedGain: 52,
    tissueProfile: "muscle",
    vesselCount: 0,
    hasBoneInterface: true,
    layerBrightness: [0.75, 0.6, 1.3, 0.9, 0.85, 1.6],
  },
  
  // ABDOMINAL
  abdominal_superficial: {
    id: "abdominal_superficial",
    label: "Parede Abdominal - Reto",
    shortDescription: "Músculo reto do abdome e linha alba",
    clinicalTagline: "Diástase dos retos e hérnias",
    transducerType: "linear",
    recommendedFrequencyMHz: 8.0,
    recommendedDepthCm: 4.0,
    recommendedFocusCm: 2.0,
    recommendedGain: 50,
    tissueProfile: "muscle",
    vesselCount: 0,
    hasBoneInterface: false,
    layerBrightness: [0.8, 0.6, 1.3, 0.95, 1.4, 0.7],
  },
  
  // VASCULAR - with Doppler
  carotid_long: {
    id: "carotid_long",
    label: "Carótida Comum (Eixo Longo)",
    shortDescription: "Artéria carótida comum longitudinal",
    clinicalTagline: "Screening de aterosclerose e medida IMT",
    transducerType: "linear",
    recommendedFrequencyMHz: 9.0,
    recommendedDepthCm: 4.0,
    recommendedFocusCm: 2.0,
    recommendedGain: 48,
    tissueProfile: "vascular",
    vesselCount: 1,
    hasBoneInterface: false,
    layerBrightness: [0.8, 0.65, 0.85, 0.9, 1.4, 0.15, 0.8],
  },
  
  carotid_trans: {
    id: "carotid_trans",
    label: "Carótida (Eixo Transversal)",
    shortDescription: "Corte transversal da carótida",
    clinicalTagline: "Avaliação de estenose e compressibilidade",
    transducerType: "linear",
    recommendedFrequencyMHz: 9.0,
    recommendedDepthCm: 4.0,
    recommendedFocusCm: 2.0,
    recommendedGain: 48,
    tissueProfile: "vascular",
    vesselCount: 1,
    hasBoneInterface: false,
    layerBrightness: [0.8, 0.65, 0.9, 1.4, 0.15, 0.8],
  },
  
  vascular_superficial: {
    id: "vascular_superficial",
    label: "Vascular Superficial",
    shortDescription: "Vasos superficiais com Doppler",
    clinicalTagline: "Mapeamento vascular e DVT",
    transducerType: "linear",
    recommendedFrequencyMHz: 10.0,
    recommendedDepthCm: 3.5,
    recommendedFocusCm: 2.0,
    recommendedGain: 50,
    tissueProfile: "vascular",
    vesselCount: 1,
    hasBoneInterface: false,
    layerBrightness: [0.8, 0.65, 1.3, 0.95, 1.4, 0.2, 0.9],
  },
  
  // TEACHING - Physics and pathology
  tissue_with_inclusions: {
    id: "tissue_with_inclusions",
    label: "Tecido com Inclusões",
    shortDescription: "Múltiplas lesões para ensino",
    clinicalTagline: "Física do ultrassom e identificação de patologias",
    transducerType: "linear",
    recommendedFrequencyMHz: 10.0,
    recommendedDepthCm: 5.0,
    recommendedFocusCm: 2.5,
    recommendedGain: 52,
    tissueProfile: "muscle",
    vesselCount: 0,
    hasBoneInterface: true,
    layerBrightness: [0.8, 0.65, 0.95, 0.9, 1.5],
  },
};

export const getPresetById = (id: UltrasoundAnatomyPresetId) => ULTRASOUND_PRESETS[id];
export const getAllPresets = () => Object.values(ULTRASOUND_PRESETS);
export const getPresetsByTransducer = (type: "linear" | "convex" | "microconvex") => 
  Object.values(ULTRASOUND_PRESETS).filter(p => p.transducerType === type);
