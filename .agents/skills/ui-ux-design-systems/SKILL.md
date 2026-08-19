---
name: ui-ux-design-systems
description: Studio-grade UI/UX design engineering for games and interactive web apps: Design tokens, fluid typography, glassmorphism/skeuomorphism, micro-interactions, and WCAG AAA accessibility.
---

# UI/UX Design Systems Engineering Guide

This skill provides expert principles, mathematical formulas, and CSS/Tailwind architecture for building studio-grade user interfaces and design systems.

---

## 1. Design Tokens Architecture

Modern UI design systems separate foundational visual variables into three distinct token layers:

1. **Global/Primitive Tokens**: Raw color palettes, base font sizes, and spacing scalars.
2. **Semantic Tokens**: Contextual roles (`bg-surface-elevated`, `text-primary`, `border-accent-subtle`).
3. **Component Tokens**: Specific component bindings (`button-primary-bg-hover`, `modal-backdrop-blur`).

```css
:root {
  /* 1. Primitive Palette (OKLCH / HSL) */
  --color-primary-500: oklch(0.68 0.18 195);
  --color-accent-500: oklch(0.72 0.22 330);
  --color-surface-950: oklch(0.12 0.02 260);

  /* 2. Semantic Tokens */
  --bg-app: var(--color-surface-950);
  --bg-surface-glass: rgba(15, 23, 42, 0.75);
  --border-glass: rgba(255, 255, 255, 0.12);
  --text-vibrant: var(--color-primary-500);

  /* 3. Fluid Typography Scale */
  --font-step-0: clamp(0.875rem, 0.8rem + 0.35vw, 1.0rem);
  --font-step-1: clamp(1.125rem, 1.0rem + 0.6vw, 1.35rem);
  --font-step-2: clamp(1.5rem, 1.3rem + 1.0vw, 2.0rem);
  --font-step-3: clamp(2.25rem, 1.8rem + 2.0vw, 3.5rem);
}
```

---

## 2. Advanced Glassmorphism & Depth Blending

To create ultra-premium HUD overlays without visual muddying:
- Combine high-blur backdrops (`backdrop-filter: blur(16px)`) with subtle specular inner glows (`box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.2)`).
- Apply gradient border masks rather than solid border lines.

```css
.glass-panel {
  background: linear-gradient(
    135deg,
    rgba(30, 41, 59, 0.7) 0%,
    rgba(15, 23, 42, 0.85) 100%
  );
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 20px 40px -15px rgba(0, 0, 0, 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
}
```

---

## 3. Micro-Interactions & Spring Physics

Interactive elements must feel physical and responsive:
- **Active State**: Scale down (`scale: 0.96`) with instantaneous transition (`transition: transform 60ms cubic-bezier(0.2, 0, 0, 1)`).
- **Hover State**: Elevate and glow with spring rebound (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
- **Focus State**: High-contrast, offset outline for full accessibility compliance.
