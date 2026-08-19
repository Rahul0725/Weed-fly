import { Particle, Shockwave, FloatingText, Biome } from '../types';

export class ParticleSystem {
  public particles: Particle[] = [];
  public shockwaves: Shockwave[] = [];
  public floatingTexts: FloatingText[] = [];
  public weatherParticles: Particle[] = [];
  private textIdCounter: number = 1;

  // 3D Curl Noise approximation for fluid swirl
  private curlNoise(x: number, y: number, time: number): { vx: number; vy: number } {
    const eps = 0.1;
    const n1 = Math.sin((x + eps) * 0.05 + time) * Math.cos(y * 0.05);
    const n2 = Math.sin((x - eps) * 0.05 + time) * Math.cos(y * 0.05);
    const n3 = Math.sin(x * 0.05 + time) * Math.cos((y + eps) * 0.05);
    const n4 = Math.sin(x * 0.05 + time) * Math.cos((y - eps) * 0.05);

    const dy = (n1 - n2) / (2 * eps);
    const dx = -(n3 - n4) / (2 * eps);
    return { vx: dx * 1.5, vy: dy * 1.5 };
  }

  // Add trail particle from player wings / jet with curl noise
  emitTrail(x: number, y: number, color: string, vy: number) {
    const noise = this.curlNoise(x, y, performance.now() * 0.002);
    this.particles.push({
      x: x + (Math.random() * 4 - 2),
      y: y + (Math.random() * 4 - 2),
      vx: -(Math.random() * 1.8 + 2.2) + noise.vx * 0.3,
      vy: -vy * 0.12 + noise.vy * 0.4,
      life: 1.0,
      maxLife: Math.random() * 0.25 + 0.35,
      size: Math.random() * 5 + 4,
      color,
      alpha: 0.85,
      shape: 'circle'
    });
  }

  // Add burst of sparks or shattered crystal debris
  emitBurst(x: number, y: number, count: number, color: string, speedMultiplier: number = 1.0) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
      const speed = (Math.random() * 5 + 2) * speedMultiplier;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        maxLife: Math.random() * 0.35 + 0.45,
        size: Math.random() * 4 + 3,
        color,
        alpha: 1.0,
        shape: Math.random() > 0.4 ? 'crystal' : 'spark',
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.18
      });
    }
  }

  // Emit radial shockwave
  emitShockwave(x: number, y: number, maxRadius: number, color: string) {
    this.shockwaves.push({
      x,
      y,
      radius: 4,
      maxRadius,
      color,
      life: 1.0,
      maxLife: 0.45
    });
  }

  // Floating combo or score popup
  emitFloatingText(text: string, x: number, y: number, color: string = '#fbbf24', scale: number = 1.0) {
    this.floatingTexts.push({
      id: this.textIdCounter++,
      text,
      x,
      y,
      vy: -2.0,
      life: 1.0,
      maxLife: 0.75,
      color,
      scale
    });
  }

  // Biome-specific atmospheric weather simulation
  updateWeather(biome: Biome, width: number, height: number, dt: number) {
    const weatherType = biome.weatherType || 'none';
    const targetCount = weatherType === 'none' ? 0 : 25;

    // Spawn weather particles if needed
    while (this.weatherParticles.length < targetCount) {
      this.weatherParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: weatherType === 'cyber_rain' ? 3.0 : (Math.random() * 1.5 - 0.5),
        vy: weatherType === 'cyber_rain' ? (Math.random() * 6 + 7) : (weatherType === 'embers' ? -(Math.random() * 1.5 + 0.8) : (Math.random() * 1.5 + 0.5)),
        life: 1.0,
        maxLife: Math.random() * 2 + 2,
        size: weatherType === 'petals' ? 5 : (weatherType === 'cyber_rain' ? 2 : 3),
        color: biome.particleColor,
        alpha: 0.6,
        shape: weatherType === 'petals' ? 'petal' : (weatherType === 'embers' ? 'ember' : 'circle'),
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 3
      });
    }

    // Update weather particles
    for (let i = this.weatherParticles.length - 1; i >= 0; i--) {
      const p = this.weatherParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.rotation !== undefined && p.rotSpeed !== undefined) {
        p.rotation += p.rotSpeed * dt;
      }
      // Wrap around screen
      if (p.y > height || p.y < -20 || p.x > width + 20 || p.x < -20) {
        p.x = Math.random() * width;
        p.y = weatherType === 'embers' ? height + 10 : -10;
      }
    }
  }

  update(dt: number) {
    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.gravity) {
        p.vy += p.gravity;
      }
      p.life -= dt / p.maxLife;
      p.size *= 0.97;
      if (p.rotation !== undefined && p.rotSpeed !== undefined) {
        p.rotation += p.rotSpeed * dt;
      }
      if (p.life <= 0 || p.size <= 0.5) {
        this.particles.splice(i, 1);
      }
    }

    // Update Shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const s = this.shockwaves[i];
      s.life -= dt / s.maxLife;
      s.radius += (s.maxRadius - s.radius) * (dt * 8);
      if (s.life <= 0) {
        this.shockwaves.splice(i, 1);
      }
    }

    // Update Floating Texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i];
      t.y += t.vy;
      t.vy *= 0.95;
      t.life -= dt / t.maxLife;
      if (t.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();

    // Render Weather Particles
    this.weatherParticles.forEach(p => {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      if (p.shape === 'petal') {
        ctx.save();
        ctx.translate(p.x, p.y);
        if (p.rotation) ctx.rotate(p.rotation);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Render Shockwaves
    this.shockwaves.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.lineWidth = 3 * s.life;
      ctx.strokeStyle = s.color;
      ctx.globalAlpha = Math.max(0, s.life * 0.7);
      ctx.stroke();
    });

    // Render Particles (Additive blending for glow)
    ctx.globalCompositeOperation = 'lighter';
    this.particles.forEach(p => {
      ctx.globalAlpha = Math.max(0, p.life * p.alpha);
      ctx.fillStyle = p.color;

      if (p.shape === 'crystal' || p.shape === 'spark') {
        ctx.save();
        ctx.translate(p.x, p.y);
        if (p.rotation) ctx.rotate(p.rotation);
        ctx.fillRect(-p.size, -p.size / 2, p.size * 2, p.size);
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, p.size), 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Reset composite operation for text
    ctx.globalCompositeOperation = 'source-over';

    // Render Floating Text
    this.floatingTexts.forEach(t => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, t.life);
      ctx.fillStyle = t.color;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.font = `900 ${Math.floor(18 * t.scale)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.strokeText(t.text, t.x, t.y);
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    });

    ctx.restore();
  }

  clear() {
    this.particles = [];
    this.shockwaves = [];
    this.floatingTexts = [];
    this.weatherParticles = [];
  }
}
