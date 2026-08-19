/**
 * Mathematical & Physics helper functions for studio-grade game motion
 */

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function damp(current: number, target: number, smoothing: number, dt: number): number {
  return lerp(current, target, 1 - Math.exp(-smoothing * dt));
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.hypot(x2 - x1, y2 - y1);
}

// Circle to Box (AABB) intersection check
export function circleIntersectBox(
  cx: number,
  cy: number,
  r: number,
  bx: number,
  by: number,
  bw: number,
  bh: number
): boolean {
  const closestX = clamp(cx, bx, bx + bw);
  const closestY = clamp(cy, by, by + bh);
  const distX = cx - closestX;
  const distY = cy - closestY;
  return (distX * distX + distY * distY) < (r * r);
}

// Directional Camera Trauma / Shake Solver
export class CameraTrauma {
  public trauma: number = 0;
  public angle: number = 0;
  public offsetX: number = 0;
  public offsetY: number = 0;

  addTrauma(amount: number) {
    this.trauma = clamp(this.trauma + amount, 0, 1.0);
  }

  update(dt: number) {
    if (this.trauma <= 0.001) {
      this.trauma = 0;
      this.offsetX = 0;
      this.offsetY = 0;
      this.angle = 0;
      return;
    }

    // Shake is proportional to trauma squared for natural feeling
    const shake = this.trauma * this.trauma;
    const maxOffset = 18; // Max shake pixels
    const maxAngle = 0.06; // Max shake radians (~3.5 degrees)

    const seed = performance.now() * 0.02;
    this.offsetX = (Math.sin(seed * 1.7) * 0.5 + Math.cos(seed * 2.3) * 0.5) * maxOffset * shake;
    this.offsetY = (Math.cos(seed * 1.9) * 0.5 + Math.sin(seed * 2.7) * 0.5) * maxOffset * shake;
    this.angle = Math.sin(seed * 2.1) * maxAngle * shake;

    // Decay trauma over time
    this.trauma = Math.max(0, this.trauma - dt * 1.4);
  }
}
