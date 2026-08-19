---
name: photorealistic-materials
description: Advanced PBR material engineering: Subsurface scattering (SSS), dual-lobe specular clearcoat, thin-film optical interference (iridescence), and anisotropic brushed metals.
---

# Photorealistic Materials Engineering Guide

This skill details advanced light-matter interaction equations for rendering AAA physical materials in shaders.

---

## 1. Thin-Film Optical Interference (Iridescence)

Iridescence computes wavelength-dependent constructive and destructive wave interference in thin dielectric films (e.g. oil slicks, beetle shells, coated visor glass).

$$\delta = 2 n_{\text{film}} d \cos(\theta_t)$$
$$I(\lambda) = \cos^2\left(\frac{\pi \delta}{\lambda}\right)$$

```glsl
// Thin-film iridescence approximation in GLSL
vec3 computeIridescence(float cosTheta, float filmThicknessNm) {
  // Wavelengths for Red (650nm), Green (510nm), Blue (475nm)
  vec3 wavelengths = vec3(650.0, 510.0, 475.0);
  float nFilm = 1.45;
  
  float sinTheta2 = (1.0 - cosTheta * cosTheta) / (nFilm * nFilm);
  float cosThetaT = sqrt(max(0.0, 1.0 - sinTheta2));
  float opd = 2.0 * nFilm * filmThicknessNm * cosThetaT;

  vec3 phase = (2.0 * 3.14159265 * opd) / wavelengths;
  vec3 intensity = 0.5 + 0.5 * cos(phase);
  return intensity;
}
```

---

## 2. Clearcoat Dual-Lobe BRDF

Adds an isotropic, uncolored second specular lobe over a base substrate to simulate automotive clearcoat lacquer or polished crystal resin:

$$f_{\text{clearcoat}} = \frac{D_{\text{GGX}}(N, H, \alpha_c) \cdot F_0(0.04, V, H) \cdot G_{\text{Kelemen}}(L, V)}{4 (N \cdot L)(N \cdot V)}$$
