---
name: cinematic-camera-vfx
description: Cinematic camera directing: Depth of field (DoF) circle of confusion (CoC), anamorphic lens flare bokeh, chromatic aberration, and dynamic motion blur vectors.
---

# Cinematic Camera VFX Engineering Guide

This skill details post-processing algorithms and optical simulations for cinematic game rendering.

---

## 1. Circle of Confusion & Depth of Field (DoF)

The circle of confusion ($c$) for a physical camera with focal length $f$, aperture $N$, and focus distance $S_1$:

$$c = \frac{|S - S_1|}{S} \cdot \frac{f^2}{N(S_1 - f)}$$

```glsl
// Post-Processing Bokeh Fragment Shader
uniform sampler2D u_colorTexture;
uniform sampler2D u_depthTexture;
uniform float u_focusDistance;
uniform float u_focalLength;
uniform float u_aperture;

vec4 computeBokehDoF(vec2 uv) {
  float depth = texture(u_depthTexture, uv).r;
  float coc = clamp(abs(depth - u_focusDistance) * u_aperture, 0.0, 1.0);
  
  vec4 acc = vec4(0.0);
  float totalWeight = 0.0;
  
  // 16-point Golden Ratio Disk Kernel
  for (int i = 0; i < 16; i++) {
    float theta = float(i) * 2.39996323; // Golden angle
    float r = sqrt(float(i) / 16.0) * coc * 0.015;
    vec2 offset = vec2(cos(theta), sin(theta)) * r;
    vec4 sampleCol = texture(u_colorTexture, uv + offset);
    acc += sampleCol;
    totalWeight += 1.0;
  }

  return acc / totalWeight;
}
```

---

## 2. Radial Chromatic Aberration

Simulates optical prism dispersion at the outer edges of camera lenses:

```glsl
vec4 computeChromaticAberration(sampler2D tex, vec2 uv, float intensity) {
  vec2 dir = uv - vec2(0.5);
  float dist = length(dir);
  vec2 offset = dir * dist * intensity;

  float r = texture(tex, uv - offset).r;
  float g = texture(tex, uv).g;
  float b = texture(tex, uv + offset).b;
  float a = texture(tex, uv).a;

  return vec4(r, g, b, a);
}
```
