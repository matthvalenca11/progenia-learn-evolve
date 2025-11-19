/**
 * Advanced Ultrasound Simulator Types
 * Multi-modal ultrasound simulation engine
 */

export type TransducerType = 'linear' | 'convex' | 'microconvex';
export type ImagingMode = 'b-mode' | 'color-doppler';
export type AnatomyPreset = 
  | 'msk_tendon_upper_limb'
  | 'muscle_generic'
  | 'abdominal_superficial'
  | 'vascular_superficial'
  | 'tissue_with_inclusions'
  | 'generic';

/**
 * Extended configuration for advanced ultrasound lab
 */
export type UltrasoundLabConfigAdvanced = {
  enabled: boolean;
  
  // Parameter visibility toggles
  showGain: boolean;
  showDepth: boolean;
  showFrequency: boolean;
  showFocus: boolean;
  showTGC: boolean;
  showDynamicRange: boolean;
  showTransducerSelector: boolean;
  showModeSelector: boolean;
  
  // Pre-configured anatomy target
  presetAnatomy: AnatomyPreset;
  
  // Lock parameters
  lockGain?: boolean;
  lockDepth?: boolean;
  lockFrequency?: boolean;
  lockTransducer?: boolean;
  
  // Initial values
  initialGain?: number;
  initialDepth?: number;
  initialFrequency?: number;
  initialTransducer?: TransducerType;
  initialMode?: ImagingMode;
};

/**
 * Default advanced configuration
 */
export const DEFAULT_ULTRASOUND_CONFIG_ADVANCED: UltrasoundLabConfigAdvanced = {
  enabled: true,
  showGain: true,
  showDepth: true,
  showFrequency: true,
  showFocus: true,
  showTGC: true,
  showDynamicRange: true,
  showTransducerSelector: true,
  showModeSelector: true,
  presetAnatomy: 'generic',
  initialGain: 50,
  initialDepth: 6,
  initialFrequency: 7.5,
  initialTransducer: 'linear',
  initialMode: 'b-mode',
};

/**
 * Transducer specifications
 */
export type TransducerSpec = {
  name: string;
  type: TransducerType;
  frequencyRange: [number, number]; // MHz
  depthRange: [number, number]; // cm
  geometryType: 'linear' | 'sector' | 'trapezoid';
  aperture: number; // mm
  footprint: number; // mm
  beamAngle?: number; // degrees for sector
};

/**
 * Physics parameters for rendering
 */
export type UltrasoundPhysicsParams = {
  gain: number;
  depth: number;
  frequency: number;
  focus: number;
  dynamicRange: number;
  tgcCurve: number[]; // 8 values for TGC
  transducer: TransducerSpec;
  mode: ImagingMode;
  width: number;
  height: number;
  time: number;
};

/**
 * Scatterer point in 3D space
 */
export type Scatterer = {
  x: number;
  y: number;
  z: number;
  amplitude: number;
  anisotropy?: number;
};

/**
 * Anatomical layer definition
 */
export type AnatomyLayer = {
  name: string;
  depthRange: [number, number]; // as ratio 0-1
  reflectivity: number;
  echogenicity: 'anechoic' | 'hypoechoic' | 'isoechoic' | 'hyperechoic';
  texture: 'homogeneous' | 'heterogeneous' | 'striated' | 'fibrillar';
  attenuationCoeff: number;
  hasFlow?: boolean; // for vessels
  flowVelocity?: number; // cm/s
};

/**
 * Velocity field for Doppler
 */
export type VelocityField = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  magnitude: number;
};
