---
name: gpu-particles-vfx
description: >-
  GPU Compute & Transform Feedback particle simulation: Curl noise velocity fields,
  vortex attractors, collision volumes, ribbon trails, and GPU instanced particle rendering.
---

# GPU Compute Particles & Particle VFX

Simulate 1,000,000+ real-time particles at 60 FPS directly on the GPU using Compute Shaders or WebGL2 Transform Feedback.

---

## 1. 3D Curl Noise for Organic Fluid Particle Motion

Curl noise creates divergence-free vector fields where particles swirl naturally without compressing into clusters.

```glsl
// Computes Curl of Simplex 3D Noise: Curl(F) = ∇ × F
vec3 computeCurl(vec3 p) {
    const float e = 0.001;
    float dx = (simplexNoise3D(p + vec3(e, 0.0, 0.0)) - simplexNoise3D(p - vec3(e, 0.0, 0.0))) / (2.0 * e);
    float dy = (simplexNoise3D(p + vec3(0.0, e, 0.0)) - simplexNoise3D(p - vec3(0.0, e, 0.0))) / (2.0 * e);
    float dz = (simplexNoise3D(p + vec3(0.0, 0.0, e)) - simplexNoise3D(p - vec3(0.0, 0.0, e))) / (2.0 * e);

    return vec3(dy - dz, dz - dx, dx - dy);
}
```
