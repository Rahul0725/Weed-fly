/**
 * TOPOLOGICA: Sectors, Anomalies, Bestiary and Upgrade Tree Definitions
 */

import { SectorConfig, BestiaryEntry, UpgradeNode } from './types';

export const SECTORS: SectorConfig[] = [
  {
    id: 1,
    name: 'Sector 01: The Gyroid Nexus',
    subtitle: 'Periodic Non-Euclidean Manifold Calibration',
    lore: 'At the boundary of Euclidean space, the Gyroid Nexus oscillates in infinite triply periodic minimal surfaces. Calibrate spatial curvature α and temporal viscosity β to stabilize the initial dimensional tears.',
    difficulty: 1,
    anomalySpecies: ['gyroid_hydra'],
    targetStability: 500,
    entropyRate: 1.8,
    initialManifold: {
      manifoldType: 0,
      surfaceDistortion: 0.05,
      ambientColor: [0.15, 0.25, 0.45],
      glowColor: [0.35, 0.75, 1.0],
      fogDensity: 0.06,
      gravitationalWarp: 0.15
    },
    unlockedByDefault: true
  },
  {
    id: 2,
    name: 'Sector 02: Hopf Fibration Sea',
    subtitle: 'Clifford Tori & 4D Phase Alignment',
    lore: 'A vast expanse of interwoven 4D fiber bundles. Entities in this realm dip into the W-dimension. Rotate the 4D Hyper-Phase γ to unmask singularities hiding in the hyper-shadow.',
    difficulty: 2,
    anomalySpecies: ['gyroid_hydra', 'hopf_vortex'],
    targetStability: 1000,
    entropyRate: 2.3,
    initialManifold: {
      manifoldType: 1,
      surfaceDistortion: 0.12,
      ambientColor: [0.08, 0.35, 0.4],
      glowColor: [0.1, 0.95, 0.85],
      fogDensity: 0.07,
      gravitationalWarp: 0.25
    },
    unlockedByDefault: false
  },
  {
    id: 3,
    name: 'Sector 03: Calabi-Yau Fold',
    subtitle: 'Compactified Multidimensional Strings',
    lore: 'Here, six hidden spatial dimensions curl into Calabi-Yau geometry. Quantum vibrations demand precise harmonic ratios (3:2 fifths and Φ golden spiral locks) to prevent catastrophic topological collapse.',
    difficulty: 3,
    anomalySpecies: ['hopf_vortex', 'calabi_fold'],
    targetStability: 1600,
    entropyRate: 2.9,
    initialManifold: {
      manifoldType: 2,
      surfaceDistortion: 0.18,
      ambientColor: [0.35, 0.12, 0.5],
      glowColor: [0.8, 0.3, 0.95],
      fogDensity: 0.08,
      gravitationalWarp: 0.35
    },
    unlockedByDefault: false
  },
  {
    id: 4,
    name: 'Sector 04: The Möbius Singularity',
    subtitle: 'Non-Orientable Metric Inversion',
    lore: 'Inside this chiral rift, normal vectors flip with every cycle. Singularities phase across parity boundaries, requiring reverse tension weaving and synchronous dual-phase locking.',
    difficulty: 4,
    anomalySpecies: ['calabi_fold', 'mobius_rift'],
    targetStability: 2400,
    entropyRate: 3.5,
    initialManifold: {
      manifoldType: 3,
      surfaceDistortion: 0.22,
      ambientColor: [0.45, 0.2, 0.1],
      glowColor: [1.0, 0.55, 0.2],
      fogDensity: 0.09,
      gravitationalWarp: 0.45
    },
    unlockedByDefault: false
  },
  {
    id: 5,
    name: 'Sector 05: Schwarzschild Horizon',
    subtitle: 'Relativistic Light Bending & Time Dilation',
    lore: 'The intense mass tensor bends light rays into closed photon spheres. Gravitational lensing reaches critical intensity—use the Gravitational Lens to steer relativistic photon streams.',
    difficulty: 5,
    anomalySpecies: ['mobius_rift', 'schwarzschild_core'],
    targetStability: 3400,
    entropyRate: 4.2,
    initialManifold: {
      manifoldType: 4,
      surfaceDistortion: 0.3,
      ambientColor: [0.1, 0.08, 0.15],
      glowColor: [1.0, 0.3, 0.05],
      fogDensity: 0.1,
      gravitationalWarp: 0.75
    },
    unlockedByDefault: false
  },
  {
    id: 6,
    name: 'Sector 06: The Tesseract Core',
    subtitle: '8-Cell Hypercube Matrix Lattice',
    lore: 'A pulsating 4-dimensional hypercube generating rigid orthogonal gravitational grids. Enclosing its 4 apex singularities in a tetrahedral conduit cage triggers massive constructive harmonic cascades.',
    difficulty: 6,
    anomalySpecies: ['schwarzschild_core', 'tesseract_node'],
    targetStability: 4500,
    entropyRate: 4.9,
    initialManifold: {
      manifoldType: 5,
      surfaceDistortion: 0.15,
      ambientColor: [0.12, 0.38, 0.28],
      glowColor: [0.25, 1.0, 0.65],
      fogDensity: 0.08,
      gravitationalWarp: 0.4
    },
    unlockedByDefault: false
  },
  {
    id: 7,
    name: 'Sector 07: Mandelbulb Abyss',
    subtitle: 'Infinite Hyper-Dimensional Fractal Recursion',
    lore: 'A turbulent sea of 4D Mandelbulb fractals expanding at exponential rates. Entropy storms rip through the manifold, requiring instantaneous tuning to Euler’s number (e) and Golden Ratio (Φ) intervals.',
    difficulty: 7,
    anomalySpecies: ['tesseract_node', 'mandelbulb_fractal'],
    targetStability: 6000,
    entropyRate: 5.6,
    initialManifold: {
      manifoldType: 6,
      surfaceDistortion: 0.35,
      ambientColor: [0.38, 0.1, 0.3],
      glowColor: [0.95, 0.2, 0.7],
      fogDensity: 0.11,
      gravitationalWarp: 0.6
    },
    unlockedByDefault: false
  },
  {
    id: 8,
    name: 'Sector 08: Omega Convergence',
    subtitle: 'The Grand Unified Harmonic Singularity',
    lore: 'All eight dimensions converge into the Omega Singularity. Total harmonic synthesis must be achieved across spatial, temporal, and hyper-phase spectra to inaugurate the new cosmic epoch.',
    difficulty: 8,
    anomalySpecies: ['mandelbulb_fractal', 'omega_singularity'],
    targetStability: 8000,
    entropyRate: 6.5,
    initialManifold: {
      manifoldType: 7,
      surfaceDistortion: 0.4,
      ambientColor: [0.2, 0.15, 0.4],
      glowColor: [0.6, 0.8, 1.0],
      fogDensity: 0.12,
      gravitationalWarp: 0.85
    },
    unlockedByDefault: false
  }
];

export const BESTIARY_DATA: BestiaryEntry[] = [
  {
    species: 'gyroid_hydra',
    name: 'Gyroid Hydra Singularity',
    topologicalClassification: 'Genus-3 Triply Periodic Manifold',
    lore: 'A serpentine knot that propagates through saddle surfaces. It continuously branches when spatial curvature α is misaligned.',
    dimensionalSignature: '3D Projection of 4D Klein-Euler Manifold',
    harmonicWeakness: '1:1 Unison & 4:3 Perfect Fourth',
    encounteredCount: 0,
    stabilizedCount: 0
  },
  {
    species: 'hopf_vortex',
    name: 'Hopf Fibration Vortex',
    topologicalClassification: 'S3 to S2 Fiber Bundle Knot',
    lore: 'Circles interconnected in 4D space where every two linked loops produce orthogonal magnetic streamlines.',
    dimensionalSignature: 'Clifford Parallel Toroid ($S^3$ Projection)',
    harmonicWeakness: '3:2 Perfect Fifth & W-Phase γ Alignment',
    encounteredCount: 0,
    stabilizedCount: 0
  },
  {
    species: 'calabi_fold',
    name: 'Calabi-Yau Anomaly',
    topologicalClassification: 'Ricci-Flat Kähler Super-Manifold',
    lore: 'Houses the vibrational blueprints of subatomic cosmic strings. Emits intense microtonal static if not tethered in triads.',
    dimensionalSignature: '6-Dimensional Compactified Calabi Complex',
    harmonicWeakness: 'Φ Golden Ratio Nexus (1.618)',
    encounteredCount: 0,
    stabilizedCount: 0
  },
  {
    species: 'mobius_rift',
    name: 'Möbius Parity Rift',
    topologicalClassification: 'Non-Orientable 2-Manifold Boundary',
    lore: 'A one-sided tear in the spacetime continuum. Reverses the momentum tensor of any gravitational conduit traversing it.',
    dimensionalSignature: '2D Non-Orientable Surface in 4D Space',
    harmonicWeakness: '√2 Harmonic Tritone (1.414)',
    encounteredCount: 0,
    stabilizedCount: 0
  },
  {
    species: 'schwarzschild_core',
    name: 'Schwarzschild Singular Mass',
    topologicalClassification: 'Event Horizon Gravitational Well',
    lore: 'A hyper-dense mass point that curves incoming light rays into spirals. Generates extreme local entropy if left unanchored.',
    dimensionalSignature: '4D Relativistic Schwarzschild Metric',
    harmonicWeakness: '2:1 Super Octave & Gravitational Lens Deflection',
    encounteredCount: 0,
    stabilizedCount: 0
  },
  {
    species: 'tesseract_node',
    name: 'Tesseract 8-Cell Singularity',
    topologicalClassification: 'Regular Convex 4-Polytope Core',
    lore: 'A crystal of pure 4-dimensional symmetry. Requires 4-point quadrilateral conduit cages to initiate constructive collapse.',
    dimensionalSignature: 'Orthogonal 4D Polychoron Boundary',
    harmonicWeakness: 'e Euler Transcendence (2.718)',
    encounteredCount: 0,
    stabilizedCount: 0
  },
  {
    species: 'mandelbulb_fractal',
    name: 'Mandelbulb Chaos Node',
    topologicalClassification: 'Iterated Spherical Power Fractal',
    lore: 'A self-similar infinite boundary of quantum entropy. Rapidly expands unless suppressed by high temporal viscosity β.',
    dimensionalSignature: 'Hyper-Complex 4D Quaternion Fractal',
    harmonicWeakness: 'Alternating Φ Golden Ratio & 3:2 Perfect Fifth',
    encounteredCount: 0,
    stabilizedCount: 0
  },
  {
    species: 'omega_singularity',
    name: 'Omega Cosmic Singularity',
    topologicalClassification: 'Universal 8-Dimensional Convergence Point',
    lore: 'The heart of all topological existence. Pulsates in synchrony with the universal harmonic fundamental.',
    dimensionalSignature: 'Grand Unified Manifold Singularity',
    harmonicWeakness: 'Full Tri-Harmonic Resonant Harmony',
    encounteredCount: 0,
    stabilizedCount: 0
  }
];

export const UPGRADE_NODES: UpgradeNode[] = [
  // HARMONICS
  {
    id: 'res_q_factor',
    name: 'Resonance Q-Factor',
    category: 'HARMONICS',
    description: 'Widens the mathematical tolerance window for achieving constructive harmonic ratio locks.',
    level: 0,
    maxLevel: 5,
    costBase: 120,
    costMultiplier: 1.8,
    unlocked: true,
    effectValue: 0.08,
    statDescription: (lvl) => `Tolerance Window: +${(lvl * 15).toFixed(0)}%`
  },
  {
    id: 'flux_multiplier',
    name: 'Photonic Yield Synthesizer',
    category: 'HARMONICS',
    description: 'Increases the Chroma-Flux yield when collapsing crystalline singularities.',
    level: 0,
    maxLevel: 5,
    costBase: 150,
    costMultiplier: 2.0,
    unlocked: true,
    effectValue: 1.0,
    statDescription: (lvl) => `Chroma-Flux Yield: +${(lvl * 25).toFixed(0)}%`
  },
  {
    id: 'golden_ratio_amplifier',
    name: 'Golden Ratio (Φ) Focus',
    category: 'HARMONICS',
    description: 'Grants extra score and instant entropy purge when locking into the Golden Ratio (1.618).',
    level: 0,
    maxLevel: 3,
    costBase: 300,
    costMultiplier: 2.2,
    unlocked: false,
    effectValue: 0,
    statDescription: (lvl) => `Φ Lock Multiplier: +${(lvl * 50).toFixed(0)}%`
  },

  // TETHER
  {
    id: 'tether_capacity',
    name: 'Phase Conduit Bandwidth',
    category: 'TETHER',
    description: 'Allows maintaining more simultaneous active gravitational conduits across singularities.',
    level: 0,
    maxLevel: 4,
    costBase: 100,
    costMultiplier: 1.7,
    unlocked: true,
    effectValue: 6,
    statDescription: (lvl) => `Max Active Conduits: ${6 + lvl * 2}`
  },
  {
    id: 'conduit_tension_stability',
    name: 'Harmonic Elasticity',
    category: 'TETHER',
    description: 'Increases the lifespan and rupture threshold of stretched phase conduits.',
    level: 0,
    maxLevel: 5,
    costBase: 140,
    costMultiplier: 1.8,
    unlocked: true,
    effectValue: 1.0,
    statDescription: (lvl) => `Conduit Stability: +${(lvl * 20).toFixed(0)}%`
  },
  {
    id: 'multi_knot_cascade',
    name: 'Hyper-Knot Transduction',
    category: 'TETHER',
    description: 'Collapsing a 4-point closed loop triggers a chain reaction to adjacent singularities.',
    level: 0,
    maxLevel: 3,
    costBase: 350,
    costMultiplier: 2.4,
    unlocked: false,
    effectValue: 0,
    statDescription: (lvl) => `Cascade Radius: +${lvl * 30}%`
  },

  // GRAVITY
  {
    id: 'lens_focus_radius',
    name: 'Gravitational Lens Aperture',
    category: 'GRAVITY',
    description: 'Expands the effective radius and light-bending curvature of the interactive gravitational lens.',
    level: 0,
    maxLevel: 5,
    costBase: 130,
    costMultiplier: 1.9,
    unlocked: true,
    effectValue: 0.25,
    statDescription: (lvl) => `Lens Radius: +${(lvl * 20).toFixed(0)}%`
  },
  {
    id: 'singularity_anchor_pull',
    name: 'Tachyon Gravitational Well',
    category: 'GRAVITY',
    description: 'Increases the gravitational pull force that draws wandering singularities toward your focus point.',
    level: 0,
    maxLevel: 4,
    costBase: 200,
    costMultiplier: 2.0,
    unlocked: false,
    effectValue: 1.0,
    statDescription: (lvl) => `Gravitational Pull: +${(lvl * 30).toFixed(0)}%`
  },

  // CHRONOS
  {
    id: 'entropy_damping_field',
    name: 'Chrono-Viscosity Damper',
    category: 'CHRONOS',
    description: 'Slows down the rate at which global entropy fractures accumulate during turbulence.',
    level: 0,
    maxLevel: 5,
    costBase: 180,
    costMultiplier: 1.9,
    unlocked: true,
    effectValue: 1.0,
    statDescription: (lvl) => `Entropy Rate: -${(lvl * 12).toFixed(0)}%`
  },
  {
    id: 'temporal_stasis_burst',
    name: 'Phase-Stasis Capacitor',
    category: 'CHRONOS',
    description: 'Unlocks a secondary shockwave burst that momentarily freezes singularity drift upon perfect resonance lock.',
    level: 0,
    maxLevel: 3,
    costBase: 400,
    costMultiplier: 2.5,
    unlocked: false,
    effectValue: 0,
    statDescription: (lvl) => `Stasis Duration: ${(lvl * 1.2).toFixed(1)}s`
  }
];
