import { useEffect, useRef } from 'react';
import { UltrasoundPhysicsParams, AnatomyLayer } from '@/types/ultrasoundAdvanced';

/**
 * Noise functions for speckle generation
 */
function noise2D(x: number, y: number, seed: number = 0): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}

function multiOctaveNoise(x: number, y: number, octaves: number, seed: number): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    value += noise2D(x * frequency, y * frequency, seed + i) * amplitude;
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value / maxValue;
}

/**
 * Rayleigh distribution for realistic speckle
 */
function rayleighNoise(sigma: number = 0.5): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return sigma * Math.sqrt(-2 * Math.log(u1)) * Math.abs(Math.cos(2 * Math.PI * u2));
}

/**
 * Generate velocity field for Doppler
 */
function generateVelocityField(
  width: number,
  height: number,
  layers: AnatomyLayer[],
  depthCm: number
): Float32Array {
  const velocityField = new Float32Array(width * height * 2); // vx, vy
  
  for (let y = 0; y < height; y++) {
    const depthRatio = y / height;
    const currentDepth = depthRatio * depthCm;
    
    // Find if we're in a vessel
    const layer = layers.find(l => {
      const [minD, maxD] = l.depthRange;
      return depthRatio >= minD && depthRatio <= maxD && l.hasFlow;
    });
    
    if (layer && layer.flowVelocity) {
      for (let x = 0; x < width; x++) {
        const lateralRatio = (x - width / 2) / width;
        const idx = (y * width + x) * 2;
        
        // Parabolic flow profile (laminar)
        const distFromCenter = Math.abs(lateralRatio * 4);
        const profile = Math.max(0, 1 - distFromCenter * distFromCenter);
        
        // Velocity in cm/s
        const velocity = layer.flowVelocity * profile;
        
        velocityField[idx] = velocity * 0.7; // vx (mostly axial)
        velocityField[idx + 1] = velocity * 0.3; // vy (some lateral)
      }
    }
  }
  
  return velocityField;
}

/**
 * Generate ultrasound frame with advanced physics
 */
function generateAdvancedUltrasoundFrame(
  ctx: CanvasRenderingContext2D,
  params: UltrasoundPhysicsParams,
  layers: AnatomyLayer[]
): void {
  const { width, height, gain, depth, frequency, focus, dynamicRange, tgcCurve, transducer, mode, compoundEnabled, harmonicEnabled, time } = params;

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  // Physics constants
  const baseAttenuationCoeff = 0.65;
  const attenuationCoeff = baseAttenuationCoeff * frequency;
  const gainFactor = Math.pow(10, (gain - 50) / 40);
  const focusDepthCm = focus;
  const maxDepthCm = depth;

  // Geometry parameters based on transducer
  const { geometryType, beamAngle } = transducer;
  
  // Generate velocity field for Doppler modes
  const velocityField = (mode === 'color-doppler' || mode === 'pw-doppler') 
    ? generateVelocityField(width, height, layers, maxDepthCm)
    : null;

  // Compound imaging: simulate multiple angles
  const numAngles = compoundEnabled ? 5 : 1;
  const angleRange = compoundEnabled ? 15 : 0; // degrees

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Normalized coordinates
      const depthRatio = y / height;
      const lateralRatio = (x - width / 2) / width;
      const depthCm = depthRatio * maxDepthCm;

      // Beam geometry
      let beamIntensity = 1.0;
      
      if (geometryType === 'sector' || geometryType === 'trapezoid') {
        // Fan/sector scan
        const maxAngle = (beamAngle || 70) / 2;
        const angleAtDepth = lateralRatio * maxAngle;
        const beamWidth = geometryType === 'sector' ? 0.15 : 0.20 + depthRatio * 0.25;
        const distFromCenter = Math.abs(lateralRatio);
        
        if (distFromCenter > beamWidth) {
          const overshoot = (distFromCenter - beamWidth) / 0.08;
          beamIntensity = Math.max(0, 1 - overshoot * overshoot);
        }
      } else {
        // Linear scan
        const beamCenterWidth = 0.18 + depthRatio * 0.15;
        const distFromCenter = Math.abs(lateralRatio);
        
        if (distFromCenter > beamCenterWidth) {
          const overshoot = (distFromCenter - beamCenterWidth) / 0.12;
          beamIntensity = Math.max(0, 1 - overshoot);
        }
      }

      // Depth attenuation with TGC compensation
      const attenuation_dB = attenuationCoeff * depthCm;
      let attenuationFactor = Math.pow(10, -attenuation_dB / 20);
      
      // Apply TGC curve (8 zones)
      const tgcIndex = Math.floor(depthRatio * 8);
      const tgcGain = tgcCurve[Math.min(tgcIndex, 7)] / 50;
      attenuationFactor *= (1 + tgcGain * 0.5);

      // Focal zone enhancement
      const focusSigma = 0.8;
      const distanceFromFocus = Math.abs(depthCm - focusDepthCm);
      const focusEnhancement = Math.exp(
        -Math.pow(distanceFromFocus, 2) / (2 * focusSigma * focusSigma)
      );
      const totalFocusGain = 0.65 + 0.7 * focusEnhancement;
      
      // Blur away from focus
      const blurFactor = 1.0 - 0.25 * Math.min(distanceFromFocus / 2, 1);

      // Multi-scale Rayleigh-distributed speckle
      const noiseScale = 0.025 * frequency;
      const fineSpeckle = multiOctaveNoise(
        x * noiseScale + time * 0.006,
        y * noiseScale + time * 0.009,
        5,
        12345
      );
      const mediumSpeckle = multiOctaveNoise(
        x * noiseScale * 0.4 + time * 0.004,
        y * noiseScale * 0.4 + time * 0.006,
        3,
        54321
      );
      const rayleighMod = rayleighNoise(0.35);
      const speckleBase = (fineSpeckle * 0.65 + mediumSpeckle * 0.35);
      const speckleNoise = speckleBase * (0.6 + 0.4 * rayleighMod);

      // Find current anatomical layer
      const currentLayer = layers.find(l => {
        const [minD, maxD] = l.depthRange;
        return depthRatio >= minD && depthRatio <= maxD;
      });

      let tissueReflectivity = 0.30;
      let tissueBoost = 1.0;
      let posteriorEnhancement = 1.0;
      let textureModulation = 1.0;

      if (currentLayer) {
        tissueReflectivity = currentLayer.reflectivity;
        attenuationFactor *= Math.exp(-currentLayer.attenuationCoeff * depthCm * 0.5);

        // Texture-based modulation
        switch (currentLayer.texture) {
          case 'striated': {
            const striationAngle = Math.sin((y * 0.2 + x * 0.06) + time * 0.05);
            textureModulation = 0.85 + Math.abs(striationAngle) * 0.15;
            break;
          }
          case 'fibrillar': {
            const fibrilPattern = Math.sin(y * 0.4 + time * 0.08) * Math.cos(x * 0.15);
            textureModulation = 0.90 + Math.abs(fibrilPattern) * 0.10;
            break;
          }
          case 'heterogeneous': {
            const heteroNoise = multiOctaveNoise(x * 0.04, y * 0.04, 2, 77777);
            textureModulation = 0.80 + heteroNoise * 0.20;
            break;
          }
          case 'homogeneous':
          default:
            textureModulation = 1.0;
        }

        // Echogenicity boost
        switch (currentLayer.echogenicity) {
          case 'anechoic':
            tissueBoost = 0.05;
            posteriorEnhancement = 1.20; // Enhancement below cysts/vessels
            break;
          case 'hypoechoic':
            tissueBoost = 0.45;
            posteriorEnhancement = 1.10;
            break;
          case 'isoechoic':
            tissueBoost = 1.0;
            break;
          case 'hyperechoic':
            tissueBoost = 1.8;
            break;
        }
      }

      // Check for posterior enhancement from previous layers
      for (const layer of layers) {
        if (layer.depthRange[1] < depthRatio && layer.echogenicity === 'anechoic') {
          posteriorEnhancement *= 1.12;
        }
      }

      // Near-field clutter
      if (depthRatio < 0.03) {
        tissueBoost *= 2.5;
        tissueReflectivity = Math.max(tissueReflectivity, 0.85);
      }

      // Lateral shadowing
      const edgeDistance = Math.abs(lateralRatio);
      if (edgeDistance > 0.38) {
        const shadowFactor = Math.max(0, 1 - (edgeDistance - 0.38) / 0.15);
        tissueBoost *= 0.4 + 0.6 * shadowFactor;
      }

      // Compound imaging simulation
      let compoundFactor = 1.0;
      if (compoundEnabled) {
        let angleSum = 0;
        for (let a = 0; a < numAngles; a++) {
          const angleDeg = ((a / (numAngles - 1)) - 0.5) * angleRange;
          const angleRad = (angleDeg * Math.PI) / 180;
          const lateralShift = Math.tan(angleRad) * depthRatio * 100;
          const shiftedX = x + lateralShift;
          if (shiftedX >= 0 && shiftedX < width) {
            angleSum += 1.0;
          }
        }
        compoundFactor = 0.85 + 0.15 * (angleSum / numAngles);
      }

      // Harmonic imaging
      let harmonicFactor = 1.0;
      if (harmonicEnabled) {
        // Harmonic reduces near-field clutter and improves contrast
        const harmonicDepthFactor = Math.min(depthRatio * 3, 1);
        harmonicFactor = 1.0 - 0.3 * (1 - harmonicDepthFactor);
        if (currentLayer?.echogenicity === 'anechoic') {
          harmonicFactor *= 0.7; // Better cyst visualization
        }
      }

      // Combine all factors for B-mode
      let intensity =
        tissueReflectivity *
        attenuationFactor *
        totalFocusGain *
        beamIntensity *
        gainFactor *
        tissueBoost *
        posteriorEnhancement *
        blurFactor *
        textureModulation *
        compoundFactor *
        harmonicFactor *
        (0.35 + 0.65 * speckleNoise);

      // Add motion jitter
      const motionNoise = Math.sin(time * 0.4 + x * 0.08 + y * 0.12) * 0.02;
      const microJitter = (Math.random() - 0.5) * 0.012;
      intensity *= 0.98 + motionNoise + microJitter;

      // Mode-specific rendering
      if (mode === 'color-doppler' && velocityField && currentLayer?.hasFlow) {
        const velIdx = (y * width + x) * 2;
        const vx = velocityField[velIdx];
        const vy = velocityField[velIdx + 1];
        const velocity = Math.sqrt(vx * vx + vy * vy);
        
        if (velocity > 0.5) {
          // Doppler shift calculation (simplified)
          const dopplerShift = (2 * frequency * 1e6 * velocity) / 1540; // Hz
          const aliasThreshold = 2000; // PRF threshold
          const normalized = (dopplerShift / aliasThreshold);
          
          // Aliasing
          const wrappedVel = ((normalized + 1) % 2) - 1;
          
          // Color mapping: red = toward, blue = away
          if (wrappedVel > 0) {
            data[idx] = Math.min(255, 100 + wrappedVel * 155);
            data[idx + 1] = Math.min(255, 20 + wrappedVel * 60);
            data[idx + 2] = 0;
          } else {
            data[idx] = 0;
            data[idx + 1] = Math.min(255, 20 - wrappedVel * 60);
            data[idx + 2] = Math.min(255, 100 - wrappedVel * 155);
          }
          data[idx + 3] = Math.min(255, Math.abs(wrappedVel) * 220);
        } else {
          // No flow - show grayscale B-mode
          const pixelValue = Math.floor(Math.max(0, Math.min(1, intensity)) * 255);
          data[idx] = pixelValue;
          data[idx + 1] = pixelValue;
          data[idx + 2] = pixelValue;
          data[idx + 3] = 255;
        }
      } else {
        // B-mode, M-mode, harmonic - grayscale
        // Dynamic range compression
        intensity = Math.pow(intensity, 1 / (dynamicRange / 50));
        
        // Clamp and convert to grayscale
        const pixelValue = Math.floor(Math.max(0, Math.min(1, intensity)) * 255);
        
        data[idx] = pixelValue;
        data[idx + 1] = pixelValue;
        data[idx + 2] = pixelValue;
        data[idx + 3] = 255;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Advanced ultrasound engine hook
 */
export function useUltrasoundEngineAdvanced(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  params: UltrasoundPhysicsParams,
  layers: AnatomyLayer[],
  isActive: boolean = true
) {
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Animation loop
    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      
      generateAdvancedUltrasoundFrame(ctx, {
        ...params,
        time: elapsed,
      }, layers);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [canvasRef, params, layers, isActive]);
}
