import { useMemo } from 'react';
import { TransducerSpec, TransducerType } from '@/types/ultrasoundAdvanced';

/**
 * Get transducer specifications
 */
export function useTransducerSpecs(): Record<TransducerType, TransducerSpec> {
  return useMemo(() => ({
    linear: {
      name: 'Linear Array',
      type: 'linear',
      frequencyRange: [7, 18],
      depthRange: [1, 6],
      geometryType: 'linear',
      aperture: 40,
      footprint: 40,
    },
    convex: {
      name: 'Curved Array',
      type: 'convex',
      frequencyRange: [2, 6],
      depthRange: [3, 20],
      geometryType: 'trapezoid',
      aperture: 50,
      footprint: 60,
      beamAngle: 70,
    },
    phased: {
      name: 'Phased Array',
      type: 'phased',
      frequencyRange: [1, 5],
      depthRange: [5, 25],
      geometryType: 'sector',
      aperture: 15,
      footprint: 20,
      beamAngle: 90,
    },
    'high-freq': {
      name: 'High Frequency',
      type: 'high-freq',
      frequencyRange: [12, 22],
      depthRange: [0.5, 4],
      geometryType: 'linear',
      aperture: 25,
      footprint: 38,
    },
    endocavitary: {
      name: 'Endocavitary',
      type: 'endocavitary',
      frequencyRange: [5, 12],
      depthRange: [2, 10],
      geometryType: 'sector',
      aperture: 20,
      footprint: 15,
      beamAngle: 120,
    },
  }), []);
}
