---
name: raymarching-sdf-3d
description: >-
  3D Signed Distance Fields (SDF) & Sphere Tracing: Primitive equations (Toroids, Gyroids, Mandelbulbs),
  smooth minimum blending (smin), soft shadows, ambient occlusion, and volumetric lighting.
---

# 3D Raymarching & Signed Distance Fields (SDF)

Raymarching allows rendering infinite complex mathematical geometries, fractals, organic blends, and volumetric clouds without polygon meshes.

---

## 1. Core 3D SDF Primitives & Operations

```glsl
// Smooth Minimum (Polynomial smin for organic blending)
float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

// 3D Sphere
float sdSphere(vec3 p, float r) {
    return length(p) - r;
}

// 3D Rounded Box
float sdRoundBox(vec3 p, vec3 b, float r) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

// 3D Torus
float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

// Soft Shadow Calculation
float calcSoftShadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
    float res = 1.0;
    float t = mint;
    for (int i = 0; i < 32 && t < maxt; i++) {
        float h = sdSphere(ro + rd * t, 0.5); // Replace with map(p)
        if (h < 0.001) return 0.0;
        res = min(res, k * h / t);
        t += h;
    }
    return clamp(res, 0.0, 1.0);
}
```
