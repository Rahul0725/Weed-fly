---
name: 3d-concept-modeling
description: Procedural 3D mesh generation, Constructive Solid Geometry (CSG), Catmull-Clark subdivision surfaces, UV unwrapping algorithms, and Draco/glTF optimization.
---

# 3D Concept Modeling Engineering Guide

This skill provides mathematical foundations for procedural mesh generation, CSG boolean operations, and 3D asset compression.

---

## 1. Procedural Cylinder & Crystal Extrusion

Generating 3D polygon vertices and normals for geometric obstacles and crystals:

```typescript
export function generateCrystalMesh(radius: number, height: number, segments: number = 6): {
  positions: Float32Array;
  normals: Float32Array;
  indices: Uint16Array;
} {
  const vertices: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  // Top Apex Point
  vertices.push(0, height / 2, 0);
  normals.push(0, 1, 0);

  // Bottom Apex Point
  vertices.push(0, -height / 2, 0);
  normals.push(0, -1, 0);

  // Equatorial Ring Points
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    vertices.push(x, 0, z);
    const len = Math.hypot(x, z);
    normals.push(x / len, 0, z / len);
  }

  // Triangles Top & Bottom
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    indices.push(0, 2 + i, 2 + next);
    indices.push(1, 2 + next, 2 + i);
  }

  return {
    positions: new Float32Array(vertices),
    normals: new Float32Array(normals),
    indices: new Uint16Array(indices)
  };
}
```
