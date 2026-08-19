---
name: pbr-shading
description: >-
  Physically Based Rendering (PBR) shader engineering guide: Cook-Torrance microfacet specular BRDF,
  GGX normal distribution, Fresnel-Schlick approximation, Smith geometry attenuation, and Image-Based Lighting (IBL).
---

# Physically Based Rendering (PBR) Shading Guide

PBR simulates real-world interaction of light with surfaces using energy conservation and microfacet theory.

---

## 1. Cook-Torrance Specular BRDF Equations

$$f_r = k_d f_{\text{lambert}} + k_s \frac{D \cdot G \cdot F}{4 (\omega_o \cdot n)(\omega_i \cdot n)}$$

- **$D$ (Normal Distribution)**: Trowbridge-Reitz GGX
- **$F$ (Fresnel)**: Fresnel-Schlick
- **$G$ (Geometry Masking)**: Smith's Schlick-GGX

```glsl
#version 300 es
precision highp float;

const float PI = 3.14159265359;

// GGX / Trowbridge-Reitz Normal Distribution Function
float DistributionGGX(vec3 N, vec3 H, float roughness) {
    float a = roughness * roughness;
    float a2 = a * a;
    float NdotH = max(dot(N, H), 0.0);
    float NdotH2 = NdotH * NdotH;
    
    float num = a2;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;
    
    return num / max(denom, 0.0000001);
}

// Schlick-GGX Geometry Function
float GeometrySchlickGGX(float NdotV, float roughness) {
    float r = (roughness + 1.0);
    float k = (r * r) / 8.0;
    return NdotV / (NdotV * (1.0 - k) + k);
}

float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
    float NdotV = max(dot(N, V), 0.0);
    float NdotL = max(dot(N, L), 0.0);
    float ggx2 = GeometrySchlickGGX(NdotV, roughness);
    float ggx1 = GeometrySchlickGGX(NdotL, roughness);
    return ggx1 * ggx2;
}

// Fresnel-Schlick Equation
vec3 FresnelSchlick(float cosTheta, vec3 F0) {
    return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}

void main() {
    // PBR Lighting Integration Example
}
```
