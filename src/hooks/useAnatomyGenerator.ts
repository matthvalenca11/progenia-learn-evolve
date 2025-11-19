import { useMemo } from 'react';
import { AnatomyLayer, AnatomyPreset } from '@/types/ultrasoundAdvanced';

/**
 * Generate procedural anatomy layers based on preset
 */
export function useAnatomyGenerator(preset: AnatomyPreset): AnatomyLayer[] {
  return useMemo(() => {
    switch (preset) {
      case 'muscle':
        return [
          {
            name: 'skin',
            depthRange: [0, 0.05],
            reflectivity: 0.85,
            echogenicity: 'hyperechoic',
            texture: 'homogeneous',
            attenuationCoeff: 0.3,
          },
          {
            name: 'subcutaneous_fat',
            depthRange: [0.05, 0.18],
            reflectivity: 0.15,
            echogenicity: 'hypoechoic',
            texture: 'heterogeneous',
            attenuationCoeff: 0.5,
          },
          {
            name: 'fascia_superficial',
            depthRange: [0.18, 0.20],
            reflectivity: 0.90,
            echogenicity: 'hyperechoic',
            texture: 'fibrillar',
            attenuationCoeff: 0.2,
          },
          {
            name: 'muscle_tissue',
            depthRange: [0.20, 0.70],
            reflectivity: 0.35,
            echogenicity: 'isoechoic',
            texture: 'striated',
            attenuationCoeff: 0.6,
          },
          {
            name: 'fascia_deep',
            depthRange: [0.70, 0.72],
            reflectivity: 0.88,
            echogenicity: 'hyperechoic',
            texture: 'fibrillar',
            attenuationCoeff: 0.2,
          },
          {
            name: 'deep_tissue',
            depthRange: [0.72, 1.0],
            reflectivity: 0.20,
            echogenicity: 'hypoechoic',
            texture: 'homogeneous',
            attenuationCoeff: 0.8,
          },
        ];
      
      case 'vascular':
        return [
          {
            name: 'skin',
            depthRange: [0, 0.04],
            reflectivity: 0.85,
            echogenicity: 'hyperechoic',
            texture: 'homogeneous',
            attenuationCoeff: 0.3,
          },
          {
            name: 'subcutaneous',
            depthRange: [0.04, 0.15],
            reflectivity: 0.18,
            echogenicity: 'hypoechoic',
            texture: 'heterogeneous',
            attenuationCoeff: 0.5,
          },
          {
            name: 'artery_wall',
            depthRange: [0.25, 0.28],
            reflectivity: 0.70,
            echogenicity: 'hyperechoic',
            texture: 'homogeneous',
            attenuationCoeff: 0.4,
            hasFlow: false,
          },
          {
            name: 'artery_lumen',
            depthRange: [0.28, 0.38],
            reflectivity: 0.02,
            echogenicity: 'anechoic',
            texture: 'homogeneous',
            attenuationCoeff: 0.1,
            hasFlow: true,
            flowVelocity: 40,
          },
          {
            name: 'vein_wall',
            depthRange: [0.50, 0.52],
            reflectivity: 0.65,
            echogenicity: 'hyperechoic',
            texture: 'homogeneous',
            attenuationCoeff: 0.4,
            hasFlow: false,
          },
          {
            name: 'vein_lumen',
            depthRange: [0.52, 0.65],
            reflectivity: 0.02,
            echogenicity: 'anechoic',
            texture: 'homogeneous',
            attenuationCoeff: 0.1,
            hasFlow: true,
            flowVelocity: 15,
          },
          {
            name: 'muscle_background',
            depthRange: [0.15, 1.0],
            reflectivity: 0.30,
            echogenicity: 'isoechoic',
            texture: 'striated',
            attenuationCoeff: 0.6,
          },
        ];
      
      case 'tendon':
        return [
          {
            name: 'skin',
            depthRange: [0, 0.04],
            reflectivity: 0.85,
            echogenicity: 'hyperechoic',
            texture: 'homogeneous',
            attenuationCoeff: 0.3,
          },
          {
            name: 'subcutaneous',
            depthRange: [0.04, 0.12],
            reflectivity: 0.15,
            echogenicity: 'hypoechoic',
            texture: 'heterogeneous',
            attenuationCoeff: 0.5,
          },
          {
            name: 'paratenon',
            depthRange: [0.12, 0.14],
            reflectivity: 0.75,
            echogenicity: 'hyperechoic',
            texture: 'homogeneous',
            attenuationCoeff: 0.3,
          },
          {
            name: 'tendon',
            depthRange: [0.14, 0.50],
            reflectivity: 0.92,
            echogenicity: 'hyperechoic',
            texture: 'fibrillar',
            attenuationCoeff: 0.4,
          },
          {
            name: 'muscle',
            depthRange: [0.50, 1.0],
            reflectivity: 0.35,
            echogenicity: 'isoechoic',
            texture: 'striated',
            attenuationCoeff: 0.6,
          },
        ];
      
      case 'bone':
        return [
          {
            name: 'skin',
            depthRange: [0, 0.05],
            reflectivity: 0.85,
            echogenicity: 'hyperechoic',
            texture: 'homogeneous',
            attenuationCoeff: 0.3,
          },
          {
            name: 'soft_tissue',
            depthRange: [0.05, 0.40],
            reflectivity: 0.30,
            echogenicity: 'isoechoic',
            texture: 'heterogeneous',
            attenuationCoeff: 0.6,
          },
          {
            name: 'periosteum',
            depthRange: [0.40, 0.42],
            reflectivity: 0.75,
            echogenicity: 'hyperechoic',
            texture: 'homogeneous',
            attenuationCoeff: 0.4,
          },
          {
            name: 'bone_cortex',
            depthRange: [0.42, 0.46],
            reflectivity: 0.98,
            echogenicity: 'hyperechoic',
            texture: 'homogeneous',
            attenuationCoeff: 1.5,
          },
          {
            name: 'acoustic_shadow',
            depthRange: [0.46, 1.0],
            reflectivity: 0.03,
            echogenicity: 'anechoic',
            texture: 'homogeneous',
            attenuationCoeff: 2.0,
          },
        ];
      
      case 'liver':
        return [
          {
            name: 'skin',
            depthRange: [0, 0.04],
            reflectivity: 0.85,
            echogenicity: 'hyperechoic',
            texture: 'homogeneous',
            attenuationCoeff: 0.3,
          },
          {
            name: 'subcutaneous_fat',
            depthRange: [0.04, 0.15],
            reflectivity: 0.15,
            echogenicity: 'hypoechoic',
            texture: 'heterogeneous',
            attenuationCoeff: 0.5,
          },
          {
            name: 'abdominal_wall',
            depthRange: [0.15, 0.25],
            reflectivity: 0.40,
            echogenicity: 'isoechoic',
            texture: 'striated',
            attenuationCoeff: 0.6,
          },
          {
            name: 'liver_parenchyma',
            depthRange: [0.25, 0.85],
            reflectivity: 0.42,
            echogenicity: 'isoechoic',
            texture: 'heterogeneous',
            attenuationCoeff: 0.5,
          },
          {
            name: 'deep_structures',
            depthRange: [0.85, 1.0],
            reflectivity: 0.25,
            echogenicity: 'hypoechoic',
            texture: 'homogeneous',
            attenuationCoeff: 0.7,
          },
        ];
      
      case 'generic':
      default:
        return [
          {
            name: 'superficial',
            depthRange: [0, 0.15],
            reflectivity: 0.65,
            echogenicity: 'hyperechoic',
            texture: 'heterogeneous',
            attenuationCoeff: 0.4,
          },
          {
            name: 'intermediate',
            depthRange: [0.15, 0.60],
            reflectivity: 0.35,
            echogenicity: 'isoechoic',
            texture: 'heterogeneous',
            attenuationCoeff: 0.6,
          },
          {
            name: 'deep',
            depthRange: [0.60, 1.0],
            reflectivity: 0.20,
            echogenicity: 'hypoechoic',
            texture: 'homogeneous',
            attenuationCoeff: 0.8,
          },
        ];
    }
  }, [preset]);
}
