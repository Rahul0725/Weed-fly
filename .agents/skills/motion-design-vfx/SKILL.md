---
name: motion-design-vfx
description: Mathematical motion design and VFX: 12 animation principles, second-order spring dynamics, non-linear trauma shake, particle choreography, and cinematic hit-stop.
---

# Motion Design & VFX Engineering Guide

This skill provides mathematical animation formulas, physics dampers, and visual impact techniques for video games and dynamic user interfaces.

---

## 1. Second-Order Dynamic Spring System

Second-order dynamics provide fluid, organic motion with customizable frequency $f$, damping ratio $\zeta$, and initial response $r$.

$$k_1 = \frac{\zeta}{\pi f}, \quad k_2 = \frac{1}{(2\pi f)^2}, \quad k_3 = \frac{r\zeta}{2\pi f}$$

```typescript
export class SecondOrderSpring {
  private xp: number; // Previous target position
  private y: number;  // Current position
  private yd: number; // Current velocity
  private k1: number;
  private k2: number;
  private k3: number;

  constructor(f: number, z: number, r: number, x0: number) {
    this.k1 = z / (Math.PI * f);
    this.k2 = 1 / Math.pow(2 * Math.PI * f, 2);
    this.k3 = (r * z) / (2 * Math.PI * f);
    this.xp = x0;
    this.y = x0;
    this.yd = 0;
  }

  public update(dt: number, x: number, xd?: number): number {
    if (xd === undefined) {
      xd = (x - this.xp) / dt;
      this.xp = x;
    }
    const k2_stable = Math.max(this.k2, 1.1 * (dt * dt / 4 + dt * this.k1 / 2));
    this.y = this.y + dt * this.yd;
    this.yd = this.yd + dt * (x + this.k3 * xd - this.y - this.k1 * this.yd) / k2_stable;
    return this.y;
  }
}
```

---

## 2. Non-Linear Camera Trauma & Shake

Camera trauma produces realistic, non-disorienting impact feedback using quadratic or cubic polynomial decay:

$$\text{Trauma} = \text{clamp}(T - \lambda \cdot \Delta t, 0, 1)$$
$$\text{Shake} = T^2 \cdot (\text{MaxOffset} \cdot \text{Noise}(t))$$

```typescript
export class CameraTraumaEngine {
  public trauma: number = 0;
  public maxOffset: number = 18;
  public maxAngle: number = 0.08; // radians

  public addTrauma(amount: number) {
    this.trauma = Math.min(1.0, this.trauma + amount);
  }

  public getShake(time: number): { x: number; y: number; angle: number } {
    const shake = this.trauma * this.trauma; // Quadratic response
    const x = this.maxOffset * shake * Math.sin(time * 37.0);
    const y = this.maxOffset * shake * Math.cos(time * 43.0);
    const angle = this.maxAngle * shake * Math.sin(time * 29.0);
    return { x, y, angle };
  }

  public update(dt: number, decayRate: number = 1.2) {
    this.trauma = Math.max(0, this.trauma - decayRate * dt);
  }
}
```
