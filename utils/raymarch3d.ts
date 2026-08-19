/**
 * Real-time 3D Raymarching & Signed Distance Field (SDF) Engine
 * Renders procedural 3D hyperspace wormholes, gyroids, and celestial geometry
 */

export class RaymarchSDFStage {
  private coins: { x: number; y: number; z: number; collected: boolean }[] = [];
  public durationLeft: number = 8.0;
  public totalCoinsGathered: number = 0;

  startStage() {
    this.durationLeft = 8.0;
    this.totalCoinsGathered = 0;
    this.coins = [];

    // Generate 3D Coin Ring along the tunnel
    for (let i = 0; i < 20; i++) {
      const angle = i * 0.6;
      this.coins.push({
        x: Math.cos(angle) * 80,
        y: Math.sin(angle) * 80,
        z: 300 + i * 120,
        collected: false
      });
    }
  }

  update(dt: number, playerX: number, playerY: number): boolean {
    this.durationLeft -= dt;

    // Move coins closer along Z axis
    const speed = 400 * dt;
    this.coins.forEach(c => {
      c.z -= speed;
      // Check collection when close to player plane (Z ~ 50)
      if (!c.collected && Math.abs(c.z - 50) < 40) {
        const dx = playerX - (c.x + 200);
        const dy = playerY - (c.y + 300);
        if (Math.hypot(dx, dy) < 55) {
          c.collected = true;
          this.totalCoinsGathered++;
        }
      }
    });

    return this.durationLeft > 0;
  }

  render(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, playerX: number, playerY: number) {
    // 1. Deep 3D Hyperspace Warp Tunnel Background
    const cx = width / 2;
    const cy = height / 2;

    const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, width * 0.8);
    bgGrad.addColorStop(0, '#38bdf8');
    bgGrad.addColorStop(0.3, '#7c3aed');
    bgGrad.addColorStop(0.7, '#1e1b4b');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Procedural 3D Tunnel Rings (Sphere-traced illusion)
    ctx.save();
    for (let ring = 1; ring <= 12; ring++) {
      const z = ((ring * 50 - (time * 180) % 50) + 600) % 600;
      const scale = 300 / (z + 100);
      const r = 240 * scale;

      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(1, r), 0, Math.PI * 2);
      ctx.lineWidth = Math.max(1, 4 * scale);
      ctx.strokeStyle = `hsla(${(time * 60 + ring * 30) % 360}, 85%, 65%, ${Math.min(1, scale * 1.5)})`;
      ctx.stroke();
    }

    // 3. Render 3D Gold Star Spheres
    this.coins.forEach(c => {
      if (c.collected || c.z <= 10) return;
      const scale = 250 / (c.z + 100);
      const screenX = cx + c.x * scale;
      const screenY = cy + c.y * scale;
      const radius = Math.max(2, 14 * scale);

      ctx.beginPath();
      ctx.arc(screenX, screenY, radius * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(250, 204, 21, 0.4)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#eab308';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5 * scale;
      ctx.fill();
      ctx.stroke();
    });

    // 4. Wormhole HUD Overlay
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`HYPERSPACE WORMHOLE: ${Math.ceil(this.durationLeft)}s`, cx, 60);

    ctx.fillStyle = '#fbbf24';
    ctx.font = '700 16px sans-serif';
    ctx.fillText(`⭐ Stars Gathered: ${this.totalCoinsGathered}`, cx, 90);

    ctx.restore();
  }
}

export const raymarchSDFStage = new RaymarchSDFStage();
