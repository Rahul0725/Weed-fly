---
name: character-concept-art
description: Game character design, silhouette readability, mechanical detailing, animation keyframing breakdown, and normal-mapped 2D sprite rendering.
---

# Character Concept Art Engineering Guide

This skill details principles for designing expressive, readable, and iconic game characters and mechanical combat entities.

---

## 1. Silhouette Readability & 3-Tone Rule

In high-speed arcade and action games:
- A character must be instantly recognizable as a solid 100% black silhouette against any high-contrast background.
- Primary mass (torso/core) holds 60% of visual weight, primary weapon/wings hold 30%, and micro-accents hold 10%.

---

## 2. Dynamic Wing Flap & Banking Trigonometry

When rendering flying aircraft or mythical creatures on HTML5 Canvas / WebGL:

```typescript
export function calculateFlightTransform(
  velocity: number,
  time: number
): { pitchAngle: number; wingFlapOffset: number; trailIntensity: number } {
  // Pitch angle tilts smoothly with vertical speed
  const pitchAngle = Math.atan2(velocity, 12.0) * 0.8;
  
  // Flap frequency accelerates during ascents
  const flapSpeed = velocity < 0 ? 18.0 : 6.0;
  const wingFlapOffset = Math.sin(time * flapSpeed) * 8.0;

  // Afterburner trail length scales with speed
  const trailIntensity = Math.min(2.0, Math.max(0.5, Math.abs(velocity) / 4.0));

  return { pitchAngle, wingFlapOffset, trailIntensity };
}
```
