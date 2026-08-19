/**
 * TOPOLOGICA: 3D Curl-Noise & Relativistic Particle System
 */

import { HarmonicFrequencies, HarmonicRatioLock, SingularityEntity, ConduitLink, PhotonicCrystal } from '../game/types';
import { Math4D } from './Math4D';

export interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  size: number;
  color: [number, number, number];
  alpha: number;
  type: 'ambient' | 'conduit' | 'collapse' | 'lens';
}

export class GPUParticleSystem {
  private particles: Particle3D[] = [];
  private readonly maxParticles = 2000;

  constructor() {
    this.initPool();
  }

  private initPool() {
    this.particles = [];
    for (let i = 0; i < 400; i++) {
      this.spawnAmbientParticle(true);
    }
  }

  // 3D Simplex-Like Curl Noise Vector Field
  private curlNoise(x: number, y: number, z: number, t: number): [number, number, number] {
    const scale = 0.8;
    const eps = 0.05;
    
    const n1 = Math.sin(y * scale + t) * Math.cos(z * scale);
    const n2 = Math.cos(x * scale + t) * Math.sin(z * scale);
    const n3 = Math.sin(x * scale) * Math.cos(y * scale + t);

    // Finite differences
    const dx = Math.sin((y + eps) * scale + t) * Math.cos(z * scale) - Math.sin((y - eps) * scale + t) * Math.cos(z * scale);
    const dy = Math.cos(x * scale + t) * Math.sin((z + eps) * scale) - Math.cos(x * scale + t) * Math.sin((z - eps) * scale);
    const dz = Math.sin((x + eps) * scale) * Math.cos(y * scale + t) - Math.sin((x - eps) * scale) * Math.cos(y * scale + t);

    return [dy - dz, dz - dx, dx - dy];
  }

  private spawnAmbientParticle(initial: boolean = false) {
    if (this.particles.length >= this.maxParticles) return;

    const angle = Math.random() * Math.PI * 2;
    const r = 0.5 + Math.random() * 2.5;
    const p: Particle3D = {
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      z: (Math.random() - 0.5) * 3.0,
      vx: 0,
      vy: 0,
      vz: 0,
      life: initial ? Math.random() * 4.0 : 0,
      maxLife: 3.0 + Math.random() * 3.0,
      size: 1.5 + Math.random() * 2.5,
      color: [0.4, 0.7, 1.0],
      alpha: 0,
      type: 'ambient'
    };
    this.particles.push(p);
  }

  public emitCollapseBurst(x: number, y: number, z: number, color: [number, number, number], count: number = 60) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) break;

      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      const speed = 1.5 + Math.random() * 3.5;

      this.particles.push({
        x,
        y,
        z,
        vx: Math.cos(theta) * Math.cos(phi) * speed,
        vy: Math.sin(theta) * Math.cos(phi) * speed,
        vz: Math.sin(phi) * speed,
        life: 0,
        maxLife: 1.0 + Math.random() * 1.5,
        size: 3.0 + Math.random() * 4.0,
        color: [...color],
        alpha: 1.0,
        type: 'collapse'
      });
    }
  }

  public emitConduitFlow(a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }, color: [number, number, number]) {
    if (this.particles.length >= this.maxParticles) return;

    const t = Math.random();
    const px = Math4D.lerp(a.x, b.x, t);
    const py = Math4D.lerp(a.y, b.y, t);
    const pz = Math4D.lerp(a.z, b.z, t);

    const dirX = b.x - a.x;
    const dirY = b.y - a.y;
    const dirZ = b.z - a.z;
    const len = Math.hypot(dirX, dirY, dirZ) || 1;

    this.particles.push({
      x: px,
      y: py,
      z: pz,
      vx: (dirX / len) * 2.0 + (Math.random() - 0.5) * 0.4,
      vy: (dirY / len) * 2.0 + (Math.random() - 0.5) * 0.4,
      vz: (dirZ / len) * 2.0 + (Math.random() - 0.5) * 0.4,
      life: 0,
      maxLife: 0.8 + Math.random() * 0.6,
      size: 2.0 + Math.random() * 2.5,
      color: [...color],
      alpha: 0.9,
      type: 'conduit'
    });
  }

  public update(
    dt: number,
    time: number,
    harmonics: HarmonicFrequencies,
    singularities: SingularityEntity[],
    conduits: ConduitLink[],
    crystals: PhotonicCrystal[],
    lensPos: { x: number; y: number; z: number } | null
  ) {
    // Maintain ambient density
    if (this.particles.length < 300) {
      this.spawnAmbientParticle();
    }

    // Spawn conduit streams
    if (conduits.length > 0 && Math.random() < 0.6) {
      const conduit = conduits[Math.floor(Math.random() * conduits.length)];
      const s1 = singularities.find(s => s.id === conduit.sourceId);
      const s2 = singularities.find(s => s.id === conduit.targetId);
      if (s1 && s2) {
        this.emitConduitFlow(s1, s2, conduit.color);
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }

      // Life fade
      const progress = p.life / p.maxLife;
      if (p.type === 'ambient') {
        p.alpha = Math.sin(progress * Math.PI) * 0.6;
      } else {
        p.alpha = 1.0 - progress;
      }

      // Physics based on particle type
      if (p.type === 'ambient') {
        const [cx, cy, cz] = this.curlNoise(p.x, p.y, p.z, time * 0.3 * harmonics.beta);
        p.vx = cx * 0.4 * harmonics.alpha;
        p.vy = cy * 0.4 * harmonics.alpha;
        p.vz = cz * 0.4;

        // Attract toward nearest singularity
        for (const s of singularities) {
          const dx = s.x - p.x;
          const dy = s.y - p.y;
          const dz = s.z - p.z;
          const dist = Math.hypot(dx, dy, dz);
          if (dist < 1.8 && dist > 0.1) {
            p.vx += (dx / dist) * 0.3;
            p.vy += (dy / dist) * 0.3;
            p.vz += (dz / dist) * 0.3;
          }
        }
      } else if (p.type === 'collapse') {
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.vz *= 0.94;
      }

      // Gravitational lens pull
      if (lensPos) {
        const dx = lensPos.x - p.x;
        const dy = lensPos.y - p.y;
        const dz = lensPos.z - p.z;
        const d = Math.hypot(dx, dy, dz);
        if (d < 2.0 && d > 0.05) {
          p.vx += (dx / d) * 1.5 * dt;
          p.vy += (dy / d) * 1.5 * dt;
          p.vz += (dz / d) * 1.5 * dt;
        }
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
    }
  }

  public render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    gamma: number
  ) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    for (const p of this.particles) {
      const proj = Math4D.project4DtoScreen(
        { x: p.x, y: p.y, z: p.z, w: 0 },
        gamma,
        width,
        height
      );

      if (!proj.visible || p.alpha <= 0.01) continue;

      const size = Math.max(1, p.size * proj.scale);
      const r = Math.round(p.color[0] * 255);
      const g = Math.round(p.color[1] * 255);
      const b = Math.round(p.color[2] * 255);
      const a = p.alpha * proj.wShadow;

      ctx.beginPath();
      ctx.arc(proj.x, proj.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      ctx.fill();
    }

    ctx.restore();
  }
}
