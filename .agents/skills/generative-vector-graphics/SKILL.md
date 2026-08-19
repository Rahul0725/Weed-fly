---
name: generative-vector-graphics
description: Procedural SVG vector generation, Catmull-Rom spline curves, Voronoi geometric tessellations, generative ornaments, and SVGO vector compression.
---

# Generative Vector Graphics Engineering Guide

This skill details algorithmic generation and mathematical optimization of SVG and vector artwork for games and web interfaces.

---

## 1. Smooth Catmull-Rom Spline to SVG Path Converter

Converts an array of 2D control points into a cubic Bezier SVG path command:

```typescript
export function catmullRomToSvgPath(points: { x: number; y: number }[], tension: number = 0.5): string {
  if (points.length < 2) return '';
  let path = `M ${points[0].x},${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6 * (1 - tension);
    const cp1y = p1.y + (p2.y - p0.y) / 6 * (1 - tension);

    const cp2x = p2.x - (p3.x - p1.x) / 6 * (1 - tension);
    const cp2y = p2.y - (p3.y - p1.y) / 6 * (1 - tension);

    path += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }

  return path;
}
```

---

## 2. Geometric Generative Glyphs

Parametric formulas for radial sci-fi badges, tech reticles, and game emblems:

```typescript
export function generateSciFiReticleSvg(radius: number, segments: number = 8): string {
  let svg = `<svg viewBox="-${radius*1.2} -${radius*1.2} ${radius*2.4} ${radius*2.4}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<circle r="${radius}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="8, 4" />`;
  
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x1 = Math.cos(angle) * (radius - 8);
    const y1 = Math.sin(angle) * (radius - 8);
    const x2 = Math.cos(angle) * (radius + 8);
    const y2 = Math.sin(angle) * (radius + 8);
    svg += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="currentColor" stroke-width="2" />`;
  }
  svg += `</svg>`;
  return svg;
}
```
