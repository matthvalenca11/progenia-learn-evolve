/**
 * Ultrasound Anatomy Preset Types
 * Real clinical anatomy configurations for ultrasound simulator
 */

export type UltrasoundAnatomyPresetId =
  | "msk_tendon_upper_limb"
  | "muscle_generic"
  | "abdominal_superficial"
  | "vascular_superficial"
  | "tissue_with_inclusions"
  | "shoulder_supraspinatus_long"
  | "shoulder_biceps_long"
  | "carotid_long"
  | "carotid_trans"
  | "quadriceps_muscle"
  | "achilles_tendon_long"
  | "lumbar_paravertebral"
  | "generic_muscle";

export type TissueProfile = "muscle" | "tendon" | "vascular" | "bone_surface" | "liver_like";

export type UltrasoundAnatomyPreset = {
  id: UltrasoundAnatomyPresetId;
  label: string;
  shortDescription: string;
  clinicalTagline: string;
  transducerType: "linear" | "convex" | "microconvex";
  recommendedFrequencyMHz: number;
  recommendedDepthCm: number;
  recommendedFocusCm: number;
  recommendedGain: number;
  
  // Internal rendering parameters
  tissueProfile: TissueProfile;
  vesselCount?: number;
  hasBoneInterface?: boolean;
  hasStrongShadow?: boolean;
  noiseSeed?: number;
  speckleIntensity?: number;
  layerBrightness?: number[];
};
