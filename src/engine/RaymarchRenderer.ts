/**
 * TOPOLOGICA: High-Performance WebGL 2.0 4D Raymarching Renderer
 */

import { RAYMARCH_4D_VERTEX_SHADER, RAYMARCH_4D_FRAGMENT_SHADER } from './shaders/raymarch4d.frag';
import { HarmonicFrequencies, HarmonicRatioLock, SingularityEntity } from '../game/types';

export class RaymarchRenderer {
  private gl: WebGL2RenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private vao: WebGLVertexArrayObject | null = null;
  private positionBuffer: WebGLBuffer | null = null;

  // Uniform Locations
  private uniforms: Record<string, WebGLUniformLocation | null> = {};

  private width: number = 0;
  private height: number = 0;
  private dpr: number = 1.0;
  private isInitialized: boolean = false;

  constructor(private canvas: HTMLCanvasElement) {}

  public initialize(): boolean {
    const gl = this.canvas.getContext('webgl2', {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false
    });

    if (!gl) {
      console.error('WebGL 2.0 not supported on this device.');
      return false;
    }

    this.gl = gl;

    // Compile Shaders
    const vs = this.compileShader(gl.VERTEX_SHADER, RAYMARCH_4D_VERTEX_SHADER);
    const fs = this.compileShader(gl.FRAGMENT_SHADER, RAYMARCH_4D_FRAGMENT_SHADER);

    if (!vs || !fs) {
      console.error('Failed to compile 4D Raymarching shaders.');
      return false;
    }

    const program = gl.createProgram();
    if (!program) return false;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Shader program link error:', gl.getProgramInfoLog(program));
      return false;
    }

    this.program = program;

    // Quad Geometry Setup
    const positions = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);

    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);

    // Cache Uniform Locations
    this.cacheUniformLocations();

    this.isInitialized = true;
    return true;
  }

  private compileShader(type: number, source: string): WebGLShader | null {
    const gl = this.gl;
    if (!gl) return null;

    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  private cacheUniformLocations() {
    const gl = this.gl;
    const prog = this.program;
    if (!gl || !prog) return;

    const names = [
      'u_resolution',
      'u_time',
      'u_cam_pos',
      'u_cam_target',
      'u_alpha',
      'u_beta',
      'u_gamma',
      'u_manifold_type',
      'u_surface_distortion',
      'u_gravitational_warp',
      'u_resonance_level',
      'u_resonance_color',
      'u_ambient_color',
      'u_glow_color',
      'u_singularity_count',
      'u_mouse_pos',
      'u_lens_active',
      'u_lens_radius',
    ];

    for (const name of names) {
      this.uniforms[name] = gl.getUniformLocation(prog, name);
    }

    for (let i = 0; i < 8; i++) {
      this.uniforms[`u_singularities[${i}]`] = gl.getUniformLocation(prog, `u_singularities[${i}]`);
      this.uniforms[`u_singularity_colors[${i}]`] = gl.getUniformLocation(prog, `u_singularity_colors[${i}]`);
    }
  }

  public resize(width: number, height: number, dpr: number = Math.min(window.devicePixelRatio || 1, 1.5)) {
    this.width = width;
    this.height = height;
    this.dpr = dpr;

    const renderW = Math.floor(width * dpr);
    const renderH = Math.floor(height * dpr);

    if (this.canvas.width !== renderW || this.canvas.height !== renderH) {
      this.canvas.width = renderW;
      this.canvas.height = renderH;
    }

    if (this.gl) {
      this.gl.viewport(0, 0, renderW, renderH);
    }
  }

  public render(
    time: number,
    harmonics: HarmonicFrequencies,
    harmonicLock: HarmonicRatioLock,
    singularities: SingularityEntity[],
    manifoldType: number,
    surfaceDistortion: number,
    gravitationalWarp: number,
    ambientColor: [number, number, number],
    glowColor: [number, number, number],
    camPos: [number, number, number],
    camTarget: [number, number, number],
    mousePos: [number, number],
    lensActive: boolean,
    lensRadius: number = 0.25
  ) {
    const gl = this.gl;
    if (!gl || !this.program || !this.vao || !this.isInitialized) return;

    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);

    // Uniform Updates
    gl.uniform2f(this.uniforms['u_resolution'], this.canvas.width, this.canvas.height);
    gl.uniform1f(this.uniforms['u_time'], time);
    gl.uniform3f(this.uniforms['u_cam_pos'], camPos[0], camPos[1], camPos[2]);
    gl.uniform3f(this.uniforms['u_cam_target'], camTarget[0], camTarget[1], camTarget[2]);

    gl.uniform1f(this.uniforms['u_alpha'], harmonics.alpha);
    gl.uniform1f(this.uniforms['u_beta'], harmonics.beta);
    gl.uniform1f(this.uniforms['u_gamma'], harmonics.gamma);

    gl.uniform1i(this.uniforms['u_manifold_type'], manifoldType);
    gl.uniform1f(this.uniforms['u_surface_distortion'], surfaceDistortion);
    gl.uniform1f(this.uniforms['u_gravitational_warp'], gravitationalWarp);

    // Resonance Status
    gl.uniform1f(this.uniforms['u_resonance_level'], harmonicLock.precision);
    gl.uniform3fv(this.uniforms['u_resonance_color'], harmonicLock.color);
    gl.uniform3fv(this.uniforms['u_ambient_color'], ambientColor);
    gl.uniform3fv(this.uniforms['u_glow_color'], glowColor);

    // Singularities
    const count = Math.min(singularities.length, 8);
    gl.uniform1i(this.uniforms['u_singularity_count'], count);
    for (let i = 0; i < 8; i++) {
      if (i < count) {
        const s = singularities[i];
        gl.uniform4f(this.uniforms[`u_singularities[${i}]`], s.x, s.y, s.z, s.radius);
        gl.uniform3fv(this.uniforms[`u_singularity_colors[${i}]`], s.color);
      } else {
        gl.uniform4f(this.uniforms[`u_singularities[${i}]`], 0, 0, 0, 0);
        gl.uniform3f(this.uniforms[`u_singularity_colors[${i}]`], 0, 0, 0);
      }
    }

    // Gravitational Lens
    gl.uniform2f(this.uniforms['u_mouse_pos'], mousePos[0] * this.dpr, (this.height - mousePos[1]) * this.dpr);
    gl.uniform1f(this.uniforms['u_lens_active'], lensActive ? 1.0 : 0.0);
    gl.uniform1f(this.uniforms['u_lens_radius'], lensRadius);

    // Draw full-screen quad
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindVertexArray(null);
  }

  public dispose() {
    if (!this.gl) return;
    if (this.vao) this.gl.deleteVertexArray(this.vao);
    if (this.positionBuffer) this.gl.deleteBuffer(this.positionBuffer);
    if (this.program) this.gl.deleteProgram(this.program);
    this.isInitialized = false;
  }
}
