import { useEffect, useRef } from 'react';
import { UltrasoundParams } from '@/types/ultrasound';

/**
 * Simple noise generator for speckle texture
 */
function noise2D(x: number, y: number, seed: number = 0): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}

/**
 * Multi-octave noise for realistic speckle
 */
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
 * Generate realistic ultrasound frame
 */
function generateUltrasoundFrame(
  ctx: CanvasRenderingContext2D,
  params: UltrasoundParams
): void {
  const { width, height, gain, depth, frequency, focus, time } = params;

  // Create image data
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  // Physics parameters
  const attenuationCoeff = 0.5 * frequency; // dB/cm/MHz
  const maxDepthCm = depth;
  const focusDepthCm = focus;
  const gainFactor = Math.pow(10, (gain - 50) / 50); // Convert to linear scale
  const beamWidth = 2.0 / frequency; // Narrower beam for higher frequency

  // Tissue layers (as depth ratios)
  const skinEnd = 0.08;
  const fatEnd = 0.25;
  const fasciaDepth = 0.35;
  const muscleStart = 0.4;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Normalize coordinates
      const depthRatio = y / height;
      const lateralRatio = (x - width / 2) / width;
      const depthCm = depthRatio * maxDepthCm;

      // Beam geometry (trapezoid/fan shape)
      const beamCenterWidth = 0.15 + depthRatio * 0.35; // Widens with depth
      const beamEdgeSmooth = 0.08;
      const distanceFromCenter = Math.abs(lateralRatio);
      let beamIntensity = 1.0;

      if (distanceFromCenter > beamCenterWidth) {
        const overshoot = (distanceFromCenter - beamCenterWidth) / beamEdgeSmooth;
        beamIntensity = Math.max(0, 1 - overshoot);
      }

      // Depth attenuation
      const attenuation_dB = attenuationCoeff * depthCm;
      const attenuationFactor = Math.pow(10, -attenuation_dB / 20);

      // Focal zone enhancement (Gaussian)
      const focusSigma = 1.5;
      const focusEnhancement = Math.exp(
        -Math.pow(depthCm - focusDepthCm, 2) / (2 * focusSigma * focusSigma)
      );
      const totalFocusGain = 0.5 + 0.5 * focusEnhancement;

      // Base speckle noise
      const noiseScale = 0.02 * frequency; // Higher frequency = finer speckle
      const speckleNoise = multiOctaveNoise(
        x * noiseScale + time * 0.01,
        y * noiseScale + time * 0.015,
        3,
        12345
      );

      // Tissue-specific reflectivity
      let tissueReflectivity = 0.3; // Base muscle
      let tissueBoost = 1.0;

      if (depthRatio < skinEnd) {
        // Bright skin surface
        tissueReflectivity = 0.9;
        tissueBoost = 1.5;
      } else if (depthRatio < fatEnd) {
        // Hypoechoic fat
        tissueReflectivity = 0.15;
        tissueBoost = 0.7;
      } else if (Math.abs(depthRatio - fasciaDepth) < 0.02) {
        // Hyperechoic fascia line
        tissueReflectivity = 0.85;
        tissueBoost = 1.8;
      } else if (depthRatio > muscleStart) {
        // Muscle with striations
        const striationPattern = Math.sin(y * 0.3 + x * 0.05 + time * 0.1) * 0.15 + 0.85;
        tissueReflectivity = 0.35 * striationPattern;
        tissueBoost = 1.1;
      }

      // Combine all factors
      let intensity =
        tissueReflectivity *
        attenuationFactor *
        totalFocusGain *
        beamIntensity *
        gainFactor *
        tissueBoost *
        (0.5 + 0.5 * speckleNoise);

      // Add subtle motion/shimmer
      intensity *= 0.95 + 0.05 * Math.sin(time * 0.5 + x * 0.1 + y * 0.1);

      // Clamp and convert to grayscale
      intensity = Math.max(0, Math.min(1, intensity));
      const pixelValue = Math.floor(intensity * 255);

      data[idx] = pixelValue;     // R
      data[idx + 1] = pixelValue; // G
      data[idx + 2] = pixelValue; // B
      data[idx + 3] = 255;        // A
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Custom hook for ultrasound image engine
 */
export function useUltrasoundImageEngine(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  params: UltrasoundParams,
  isActive: boolean = true
) {
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Animation loop
    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      
      generateUltrasoundFrame(ctx, {
        ...params,
        time: elapsed,
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [canvasRef, params, isActive]);
}
