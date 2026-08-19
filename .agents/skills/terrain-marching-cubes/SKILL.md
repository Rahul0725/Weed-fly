---
name: terrain-marching-cubes
description: >-
  3D Voxel Terrain & Marching Cubes: Iso-surface polygonization, 3D density scalar fields,
  triplanar texture mapping, dynamic voxel destruction, and QuadTree LOD chunk management.
---

# Voxel Terrain & Marching Cubes Guide

Marching Cubes extracts seamless 3D polygon meshes from 3D scalar density fields $f(x, y, z)$.

---

## 1. 3D Density Field Evaluation

```typescript
export function evaluateDensity(x: number, y: number, z: number, noise3D: (x: number, y: number, z: number) => number): number {
  // Base ground gradient
  let density = -y;
  // Add 3D noise octaves for overhangs, caves, and mountains
  density += noise3D(x * 0.05, y * 0.05, z * 0.05) * 4.0;
  density += noise3D(x * 0.1, y * 0.1, z * 0.1) * 2.0;
  return density; // > 0 inside ground, < 0 in air
}
```

## 2. Triplanar Texture Mapping in GLSL

Eliminates UV stretching on steep vertical cliffs and cave ceilings:

```glsl
vec4 getTriplanarColor(sampler2D tex, vec3 worldPos, vec3 normal, float scale) {
    vec3 blendWeights = pow(abs(normal), vec3(4.0));
    blendWeights /= (blendWeights.x + blendWeights.y + blendWeights.z);

    vec4 colX = texture(tex, worldPos.yz * scale);
    vec4 colY = texture(tex, worldPos.xz * scale);
    vec4 colZ = texture(tex, worldPos.xy * scale);

    return colX * blendWeights.x + colY * blendWeights.y + colZ * blendWeights.z;
}
```
