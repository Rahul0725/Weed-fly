---
name: pixel-art-mastery
description: Pixel art mastery: Subpixel rendering, Bayer and Floyd-Steinberg dithering matrices, palette cycling, selective outlining (sel-out), and CRT phosphor screen shaders.
---

# Pixel Art Mastery Engineering Guide

This skill details retro visual styling, subpixel rendering, color restriction, and CRT display emulation for pixel-perfect aesthetics.

---

## 1. Ordered Bayer Dithering Matrix (4x4)

Ordered dithering creates intermediate color shades using an indexed spatial threshold matrix $M_4$:

$$M_4 = \frac{1}{16} \begin{bmatrix}
0 & 8 & 2 & 10 \\
12 & 4 & 14 & 6 \\
3 & 11 & 1 & 9 \\
15 & 7 & 13 & 5
\end{bmatrix}$$

```glsl
// GLSL Ordered Dithering Shader
float bayerDither4x4(vec2 pixelCoord) {
  int x = int(mod(pixelCoord.x, 4.0));
  int y = int(mod(pixelCoord.y, 4.0));
  
  float bayer[16] = float[16](
     0.0/16.0,  8.0/16.0,  2.0/16.0, 10.0/16.0,
    12.0/16.0,  4.0/16.0, 14.0/16.0,  6.0/16.0,
     3.0/16.0, 11.0/16.0,  1.0/16.0,  9.0/16.0,
    15.0/16.0,  7.0/16.0, 13.0/16.0,  5.0/16.0
  );

  return bayer[y * 4 + x];
}
```

---

## 2. CRT Curved Screen & Scanline Filter

```glsl
vec2 curveScreen(vec2 uv) {
  uv = uv * 2.0 - 1.0;
  vec2 offset = abs(uv.yx) / vec2(6.0, 4.0);
  uv = uv + uv * offset * offset;
  return uv * 0.5 + 0.5;
}

vec4 applyCRTScanlines(vec4 color, vec2 screenPos) {
  float scanline = sin(screenPos.y * 3.14159 * 2.0) * 0.12;
  return color - vec4(scanline);
}
```
