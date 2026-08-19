---
name: procedural-texture-art
description: Algorithmic procedural texture generation: Worley cellular noise, Perlin turbulence, anisotropic normal map kernels, PBR metallic/roughness synthesis, and seamless tiling math.
---

# Procedural Texture Art Engineering Guide

This skill covers the algorithmic generation of high-resolution textures, normal maps, roughness distributions, and ambient occlusion fields for real-time graphics.

---

## 1. Cellular / Worley Noise Formulation

Worley noise calculates Euclidean or Manhattan distance to the $K$-th closest random feature point in adjacent grid cells.

```typescript
export function worleyNoise2D(x: number, y: number, cellSize: number = 64): { f1: number; f2: number } {
  const cellX = Math.floor(x / cellSize);
  const cellY = Math.floor(y / cellSize);
  let minD1 = 1e9;
  let minD2 = 1e9;

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const neighborX = cellX + dx;
      const neighborY = cellY + dy;
      
      // Deterministic pseudo-random point inside neighbor cell
      const hash = Math.sin(neighborX * 127.1 + neighborY * 311.7) * 43758.5453;
      const pointX = (neighborX + (hash - Math.floor(hash))) * cellSize;
      const pointY = (neighborY + ((hash * 13.3) - Math.floor(hash * 13.3))) * cellSize;

      const d = Math.hypot(x - pointX, y - pointY);
      if (d < minD1) {
        minD2 = minD1;
        minD1 = d;
      } else if (d < minD2) {
        minD2 = d;
      }
    }
  }

  return { f1: minD1 / cellSize, f2: minD2 / cellSize };
}
```

---

## 2. Sobel Normal Map Synthesis

To convert any heightfield or procedural grayscale texture into a tangent-space normal map:

$$\vec{N} = \text{normalize}\left( -s_x \frac{\partial H}{\partial x}, -s_y \frac{\partial H}{\partial y}, 1.0 \right)$$

```glsl
vec3 computeNormalFromHeight(sampler2D heightMap, vec2 uv, vec2 texelSize, float normalStrength) {
  float tl = texture(heightMap, uv + vec2(-texelSize.x,  texelSize.y)).r;
  float t  = texture(heightMap, uv + vec2(          0.0,  texelSize.y)).r;
  float tr = texture(heightMap, uv + vec2( texelSize.x,  texelSize.y)).r;
  float l  = texture(heightMap, uv + vec2(-texelSize.x,          0.0)).r;
  float r  = texture(heightMap, uv + vec2( texelSize.x,          0.0)).r;
  float bl = texture(heightMap, uv + vec2(-texelSize.x, -texelSize.y)).r;
  float b  = texture(heightMap, uv + vec2(          0.0, -texelSize.y)).r;
  float br = texture(heightMap, uv + vec2( texelSize.x, -texelSize.y)).r;

  float dX = (tr + 2.0 * r + br) - (tl + 2.0 * l + bl);
  float dY = (bl + 2.0 * b + br) - (tl + 2.0 * t + tr);

  vec3 n = normalize(vec3(-dX * normalStrength, -dY * normalStrength, 1.0));
  return n * 0.5 + 0.5; // Remap to [0, 1] RGB
}
```
