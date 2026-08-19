---
name: shader-graphics
description: >-
  GLSL and WGSL shader programming guide for 2D/3D games: Post-processing (CRT, Bloom, Vignette),
  Raymarching SDFs, Particle compute shaders, and WebGL 2 material pipelines.
---

# Shader Graphics & Visual Effects Guide

Shaders execute directly on the GPU for real-time visual effects, lighting, and post-processing.

---

## 1. 2D Post-Processing CRT & Scanline Shader (GLSL 3.00 ES)

```glsl
#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;

// Barrel distortion to mimic curved glass CRT
vec2 curveUV(vec2 uv) {
    uv = (uv - 0.5) * 2.0;
    uv *= 1.1;
    uv.x *= 1.0 + pow((abs(uv.y) / 5.0), 2.0);
    uv.y *= 1.0 + pow((abs(uv.x) / 4.0), 2.0);
    uv = (uv / 2.0) + 0.5;
    return uv;
}

void main() {
    vec2 uv = curveUV(vUv);
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    // Chromatic Aberration
    float r = texture(uTexture, uv + vec2(0.002, 0.0)).r;
    float g = texture(uTexture, uv).g;
    float b = texture(uTexture, uv - vec2(0.002, 0.0)).b;

    vec3 col = vec3(r, g, b);

    // Scanlines
    float scanline = sin(uv.y * uResolution.y * 1.5 + uTime * 5.0) * 0.08;
    col -= scanline;

    // Vignette
    float vignette = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
    col *= clamp(pow(16.0 * vignette, 0.25), 0.0, 1.0);

    fragColor = vec4(col, 1.0);
}
```

---

## 2. Signed Distance Field (SDF) Raymarching

```glsl
#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform vec2 uResolution;
uniform float uTime;

float sdSphere(vec3 p, float r) {
    return length(p) - r;
}

float map(vec3 p) {
    vec3 spherePos = vec3(sin(uTime), 0.0, 2.0 + cos(uTime));
    return sdSphere(p - spherePos, 0.7);
}

void main() {
    vec2 p = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);
    vec3 ro = vec3(0.0, 0.0, -1.0); // Ray origin
    vec3 rd = normalize(vec3(p, 1.5)); // Ray direction

    float totalDist = 0.0;
    vec3 col = vec3(0.05, 0.05, 0.1);

    for (int i = 0; i < 64; i++) {
        vec3 pos = ro + rd * totalDist;
        float d = map(pos);
        if (d < 0.001) {
            vec3 normal = normalize(vec3(
                map(pos + vec3(0.001, 0, 0)) - d,
                map(pos + vec3(0, 0.001, 0)) - d,
                map(pos + vec3(0, 0, 0.001)) - d
            ));
            vec3 lightDir = normalize(vec3(1.0, 2.0, -1.0));
            float diff = max(0.0, dot(normal, lightDir));
            col = vec3(0.2, 0.7, 1.0) * diff + vec3(0.1, 0.2, 0.3);
            break;
        }
        totalDist += d;
        if (totalDist > 20.0) break;
    }

    fragColor = vec4(col, 1.0);
}
```
