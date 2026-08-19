---
name: lighting-matte-painting
description: Volumetric lighting, atmospheric perspective, light shafts (God rays), spherical harmonics irradiance baking, and environmental parallax matte painting.
---

# Lighting & Matte Painting Engineering Guide

This skill details techniques for environmental lighting, volumetric atmospheric depth, and cinematic matte painting in 2D and 3D scenes.

---

## 1. Radial Volumetric Light Shafts (God Rays)

Volumetric shafts are computed by raymarching from screen pixels toward the primary light source and accumulating occluded radiance.

```glsl
// Post-Processing God Rays Fragment Shader
uniform vec2 u_lightPositionOnScreen; // Screen UV (0 to 1)
uniform sampler2D u_occlusionTexture;
uniform float u_exposure;
uniform float u_decay;
uniform float u_density;
uniform float u_weight;

const int NUM_SAMPLES = 64;

vec4 computeGodRays(vec2 texCoord) {
  vec2 deltaTexCoord = (texCoord - u_lightPositionOnScreen) * (1.0 / float(NUM_SAMPLES) * u_density);
  vec2 currentCoord = texCoord;
  vec4 color = vec4(0.0);
  float illuminationDecay = 1.0;

  for (int i = 0; i < NUM_SAMPLES; i++) {
    currentCoord -= deltaTexCoord;
    vec4 sampleCol = texture(u_occlusionTexture, currentCoord);
    sampleCol *= illuminationDecay * u_weight;
    color += sampleCol;
    illuminationDecay *= u_decay;
  }

  return color * u_exposure;
}
```

---

## 2. Layered Parallax Matte Painting Rules

To produce infinite scenic depth:
- **Skybox (0.0x Speed)**: Static cosmic gradient with celestial bodies.
- **Far Background (0.1x Speed)**: Heavy atmospheric haze desaturation (Rayleigh scattering shift toward cyan/blue).
- **Midground Mountains (0.35x Speed)**: Silhouette contours with rim specular highlights.
- **Foreground Pillars (1.0x Speed)**: Full contrast, micro-textures, and high local ambient occlusion.
