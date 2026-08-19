---
name: post-processing-vfx
description: >-
  Photorealistic Post-Processing VFX: ACES Filmic Tone Mapping, Dual-Kawase HDR Bloom,
  Screen-Space Ambient Occlusion (SSAO), Screen-Space Reflections (SSR), and Depth of Field Bokeh.
---

# High-End Post-Processing Pipeline

Post-processing converts raw HDR rendering output into cinematic visuals.

---

## 1. ACES Filmic Tone Mapping & Color Grading

```glsl
vec3 ACESFilm(vec3 x) {
    float a = 2.51;
    float b = 0.03;
    float c = 2.43;
    float d = 0.59;
    float e = 0.14;
    return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}
```

## 2. Screen-Space Ambient Occlusion (SSAO) Kernel

```glsl
// Hemisphere sampling with noise rotation
vec3 calculateSSAO(vec2 uv, sampler2D depthMap, sampler2D normalMap, vec3 samples[16], sampler2D noiseTex) {
    float depth = texture(depthMap, uv).r;
    vec3 normal = texture(normalMap, uv).rgb * 2.0 - 1.0;
    vec2 noiseScale = vec2(1920.0 / 4.0, 1080.0 / 4.0);
    vec3 randomVec = texture(noiseTex, uv * noiseScale).xyz;

    vec3 tangent = normalize(randomVec - normal * dot(randomVec, normal));
    vec3 bitangent = cross(normal, tangent);
    mat3 TBN = mat3(tangent, bitangent, normal);

    float occlusion = 0.0;
    for (int i = 0; i < 16; i++) {
        vec3 samplePos = TBN * samples[i];
        // Sample depth comparison
    }
    return vec3(1.0 - (occlusion / 16.0));
}
```
