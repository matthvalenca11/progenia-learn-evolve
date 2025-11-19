/**
 * WebGL-based Ultrasound Rendering Engine
 * Uses ray marching for physically-based ultrasound simulation
 */

import { UltrasoundLabConfigAdvanced, AnatomyLayer } from '@/types/ultrasoundAdvanced';
import { UltrasoundInclusionConfig } from '@/types/acousticMedia';

export interface UltrasoundEngineConfig {
  // Anatomy and physics
  layers: AnatomyLayer[];
  inclusions: UltrasoundInclusionConfig[];
  
  // Transducer and imaging
  transducerType: 'linear' | 'convex' | 'microconvex';
  frequency: number; // MHz
  depth: number; // cm
  focus: number; // cm
  gain: number; // 0-100
  dynamicRange: number; // dB
  
  // Imaging mode
  mode: 'b-mode' | 'color-doppler';
  
  // Simulation features
  features: {
    showStructuralBMode: boolean;
    showBeamOverlay: boolean;
    showDepthScale: boolean;
    showFocusMarker: boolean;
    showPhysicsPanel: boolean;
    enablePosteriorEnhancement: boolean;
    enableAcousticShadow: boolean;
    enableReverberation: boolean;
    enableNearFieldClutter: boolean;
    showFieldLines: boolean;
    showAttenuationMap: boolean;
    enableColorDoppler: boolean;
    showAnatomyLabels: boolean;
  };
  
  // Animation
  time: number;
}

interface RayMarchResult {
  intensity: number;
  depth: number;
  mediumId: string;
  reflections: number;
  attenuation: number;
}

export class UltrasoundEngine {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  private config: UltrasoundEngineConfig;
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;
  
  // WebGL resources
  private program: WebGLProgram | null = null;
  private frameBuffer: ImageData | null = null;
  private ctx2d: CanvasRenderingContext2D | null = null;
  
  // Performance
  private lastFrameTime: number = 0;
  private targetFPS: number = 30;
  
  constructor(canvas: HTMLCanvasElement, config: UltrasoundEngineConfig) {
    this.canvas = canvas;
    this.config = config;
    this.initialize();
  }
  
  /**
   * Initialize WebGL context and shaders
   */
  private initialize(): void {
    // Try WebGL2 first, fallback to WebGL1, then 2D canvas
    this.gl = this.canvas.getContext('webgl2') || 
              this.canvas.getContext('webgl') ||
              null;
    
    if (!this.gl) {
      console.warn('WebGL not supported, falling back to 2D canvas');
      this.ctx2d = this.canvas.getContext('2d');
      if (!this.ctx2d) {
        throw new Error('Cannot get 2D context');
      }
      return;
    }
    
    // Initialize WebGL shaders and programs
    this.initializeShaders();
  }
  
  /**
   * Initialize WebGL shaders for ray marching
   */
  private initializeShaders(): void {
    if (!this.gl) return;
    
    const vertexShaderSource = `
      attribute vec2 position;
      varying vec2 vUV;
      void main() {
        vUV = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;
    
    const fragmentShaderSource = `
      precision highp float;
      varying vec2 vUV;
      uniform float time;
      uniform float gain;
      uniform float depth;
      uniform float frequency;
      uniform float focus;
      uniform int transducerType; // 0=linear, 1=convex, 2=microconvex
      
      // Ray marching parameters
      const int MAX_STEPS = 64;
      const float STEP_SIZE = 0.05;
      
      // Noise function for speckle
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }
      
      // Multi-octave noise for realistic speckle
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 4; i++) {
          value += amplitude * noise(p);
          p *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }
      
      // Rayleigh distribution for speckle amplitude
      float rayleigh(float x, float sigma) {
        return (x / (sigma * sigma)) * exp(-(x * x) / (2.0 * sigma * sigma));
      }
      
      // Ray marching through acoustic volume
      vec3 raymarch(vec2 uv, float t) {
        // Convert UV to ray direction based on transducer type
        vec2 origin = vec2(0.5, 0.0);
        vec2 direction;
        
        if (transducerType == 0) {
          // Linear: parallel rays
          direction = vec2(uv.x - 0.5, 1.0);
        } else if (transducerType == 1) {
          // Convex: fan from center
          float angle = (uv.x - 0.5) * 0.8;
          direction = vec2(sin(angle), cos(angle));
        } else {
          // Microconvex: narrow fan
          float angle = (uv.x - 0.5) * 0.5;
          direction = vec2(sin(angle), cos(angle));
        }
        
        direction = normalize(direction);
        
        float totalIntensity = 0.0;
        float currentDepth = 0.0;
        vec2 pos = origin;
        
        // Ray marching loop
        for (int step = 0; step < MAX_STEPS; step++) {
          pos += direction * STEP_SIZE;
          currentDepth = length(pos - origin) * depth;
          
          if (currentDepth > depth || pos.y > 1.0 || pos.x < 0.0 || pos.x > 1.0) {
            break;
          }
          
          // Frequency-dependent attenuation
          float attenuation = exp(-frequency * 0.5 * currentDepth);
          
          // Focal zone enhancement
          float focalFactor = 1.0 - abs(currentDepth - focus) / focus;
          focalFactor = max(0.0, focalFactor);
          
          // Base tissue reflectivity (simplified - would read from layers in full implementation)
          float layerReflectivity = 0.3 + 0.2 * sin(currentDepth * 3.0);
          
          // Speckle noise
          vec2 noiseCoord = pos * 50.0 + vec2(t * 0.1, 0.0);
          float speckle = fbm(noiseCoord);
          speckle = rayleigh(speckle, 0.4);
          
          // Combine factors
          float intensity = layerReflectivity * attenuation * (1.0 + focalFactor * 0.3) * speckle;
          totalIntensity += intensity * gain * 0.01;
        }
        
        // Normalize and apply gain
        totalIntensity = clamp(totalIntensity * 2.0, 0.0, 1.0);
        
        return vec3(totalIntensity);
      }
      
      void main() {
        vec3 color = raymarch(vUV, time);
        gl_FragColor = vec4(color, 1.0);
      }
    `;
    
    const vertexShader = this.compileShader(vertexShaderSource, this.gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(fragmentShaderSource, this.gl.FRAGMENT_SHADER);
    
    if (!vertexShader || !fragmentShader) {
      console.error('Failed to compile shaders');
      return;
    }
    
    this.program = this.gl.createProgram();
    if (!this.program) return;
    
    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);
    
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error('Failed to link program:', this.gl.getProgramInfoLog(this.program));
      return;
    }
    
    // Create full-screen quad
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);
    
    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
    
    const positionLocation = this.gl.getAttribLocation(this.program, 'position');
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
  }
  
  private compileShader(source: string, type: number): WebGLShader | null {
    if (!this.gl) return null;
    
    const shader = this.gl.createShader(type);
    if (!shader) return null;
    
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }
  
  /**
   * Update configuration and trigger re-render
   */
  public updateConfig(newConfig: Partial<UltrasoundEngineConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
  
  /**
   * Render a single frame
   */
  public renderFrame(): void {
    const now = performance.now();
    const deltaTime = now - this.lastFrameTime;
    
    // Throttle to target FPS
    if (deltaTime < 1000 / this.targetFPS) {
      return;
    }
    
    this.lastFrameTime = now;
    
    if (this.gl && this.program) {
      this.renderWebGL();
    } else if (this.ctx2d) {
      this.renderCanvas2D();
    }
  }
  
  /**
   * WebGL rendering path
   */
  private renderWebGL(): void {
    if (!this.gl || !this.program) return;
    
    this.gl.useProgram(this.program);
    
    // Set uniforms
    const timeLocation = this.gl.getUniformLocation(this.program, 'time');
    const gainLocation = this.gl.getUniformLocation(this.program, 'gain');
    const depthLocation = this.gl.getUniformLocation(this.program, 'depth');
    const frequencyLocation = this.gl.getUniformLocation(this.program, 'frequency');
    const focusLocation = this.gl.getUniformLocation(this.program, 'focus');
    const transducerTypeLocation = this.gl.getUniformLocation(this.program, 'transducerType');
    
    this.gl.uniform1f(timeLocation, this.config.time);
    this.gl.uniform1f(gainLocation, this.config.gain);
    this.gl.uniform1f(depthLocation, this.config.depth);
    this.gl.uniform1f(frequencyLocation, this.config.frequency);
    this.gl.uniform1f(focusLocation, this.config.focus);
    
    const transducerTypeValue = 
      this.config.transducerType === 'linear' ? 0 :
      this.config.transducerType === 'convex' ? 1 : 2;
    this.gl.uniform1i(transducerTypeLocation, transducerTypeValue);
    
    // Clear and draw
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    
    // Draw overlays if enabled
    this.drawOverlays();
  }
  
  /**
   * Canvas 2D fallback rendering path
   */
  private renderCanvas2D(): void {
    if (!this.ctx2d) return;
    
    const { width, height } = this.canvas;
    
    if (!this.frameBuffer || this.frameBuffer.width !== width || this.frameBuffer.height !== height) {
      this.frameBuffer = this.ctx2d.createImageData(width, height);
    }
    
    const data = this.frameBuffer.data;
    
    // Simplified ray marching in software
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const uv = { x: x / width, y: y / height };
        const result = this.raymarchSoftware(uv);
        
        const idx = (y * width + x) * 4;
        const intensity = Math.floor(result.intensity * 255);
        data[idx] = intensity;
        data[idx + 1] = intensity;
        data[idx + 2] = intensity;
        data[idx + 3] = 255;
      }
    }
    
    this.ctx2d.putImageData(this.frameBuffer, 0, 0);
    this.drawOverlays();
  }
  
  /**
   * Software ray marching (fallback)
   */
  private raymarchSoftware(uv: { x: number; y: number }): RayMarchResult {
    // Simplified version - full implementation would be much more complex
    const depth = uv.y * this.config.depth;
    const attenuation = Math.exp(-this.config.frequency * 0.5 * depth);
    const speckle = this.noise2D(uv.x * 50, uv.y * 50 + this.config.time * 0.1);
    const intensity = attenuation * speckle * this.config.gain * 0.01;
    
    return {
      intensity: Math.min(intensity, 1.0),
      depth,
      mediumId: 'muscle',
      reflections: 0,
      attenuation,
    };
  }
  
  private noise2D(x: number, y: number): number {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return (n - Math.floor(n)) * 2 - 1;
  }
  
  /**
   * Draw overlays (depth scale, beam, labels, etc.)
   */
  private drawOverlays(): void {
    const ctx = this.ctx2d || this.canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = this.canvas;
    const { features } = this.config;
    
    ctx.save();
    
    // Depth scale
    if (features.showDepthScale) {
      this.drawDepthScale(ctx, width, height);
    }
    
    // Focus marker
    if (features.showFocusMarker) {
      this.drawFocusMarker(ctx, width, height);
    }
    
    // Beam overlay
    if (features.showBeamOverlay) {
      this.drawBeamOverlay(ctx, width, height);
    }
    
    // Anatomy labels
    if (features.showAnatomyLabels) {
      this.drawAnatomyLabels(ctx, width, height);
    }
    
    // Field lines
    if (features.showFieldLines) {
      this.drawFieldLines(ctx, width, height);
    }
    
    ctx.restore();
  }
  
  private drawDepthScale(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
    ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    
    const steps = Math.ceil(this.config.depth);
    for (let i = 0; i <= steps; i++) {
      const y = (i / this.config.depth) * height;
      ctx.beginPath();
      ctx.moveTo(width - 30, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
      ctx.fillText(`${i}`, width - 18, y + 4);
    }
  }
  
  private drawFocusMarker(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const y = (this.config.focus / this.config.depth) * height;
    ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
    ctx.beginPath();
    ctx.moveTo(width - 25, y);
    ctx.lineTo(width - 30, y - 5);
    ctx.lineTo(width - 30, y + 5);
    ctx.fill();
  }
  
  private drawBeamOverlay(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    
    const centerX = width / 2;
    
    if (this.config.transducerType === 'linear') {
      // Parallel beam lines
      for (let i = -2; i <= 2; i++) {
        const x = centerX + (i * width / 10);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    } else {
      // Fan beam lines
      const angle = this.config.transducerType === 'convex' ? 0.8 : 0.5;
      for (let i = -2; i <= 2; i++) {
        const a = (i / 2) * angle;
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX + Math.sin(a) * height, height);
        ctx.stroke();
      }
    }
  }
  
  private drawAnatomyLabels(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.fillStyle = 'rgba(0, 255, 255, 0.7)';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    
    // Simplified - would read from actual layers
    const labels = [
      { text: 'Pele', y: 0.1 },
      { text: 'Gordura', y: 0.25 },
      { text: 'Músculo', y: 0.5 },
    ];
    
    labels.forEach(label => {
      ctx.fillText(label.text, 10, label.y * height);
    });
  }
  
  private drawFieldLines(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.strokeStyle = 'rgba(255, 255, 0, 0.15)';
    ctx.lineWidth = 1;
    
    // Draw concentric arcs representing wave propagation
    for (let i = 1; i <= 10; i++) {
      const radius = (i / 10) * height;
      ctx.beginPath();
      ctx.arc(width / 2, 0, radius, 0, Math.PI);
      ctx.stroke();
    }
  }
  
  /**
   * Start continuous rendering
   */
  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }
  
  /**
   * Stop rendering
   */
  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  /**
   * Animation loop
   */
  private animate = (): void => {
    if (!this.isRunning) return;
    
    this.config.time += 0.016; // ~60fps time increment
    this.renderFrame();
    
    this.animationFrameId = requestAnimationFrame(this.animate);
  };
  
  /**
   * Cleanup resources
   */
  public destroy(): void {
    this.stop();
    
    if (this.gl && this.program) {
      this.gl.deleteProgram(this.program);
      this.program = null;
    }
    
    this.gl = null;
    this.ctx2d = null;
    this.frameBuffer = null;
  }
}
