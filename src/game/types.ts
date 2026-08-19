/**
 * TOPOLOGICA: 4D Resonance Architect - Core Type Definitions
 */

export interface HarmonicFrequencies {
  alpha: number; // Spatial Curvature Metric (0.5 - 6.0)
  beta: number;  // Temporal Viscosity / Chrono-Flux (0.5 - 6.0)
  gamma: number; // 4D Hyper-Phase Angle in radians (0 - 2PI)
}

export type HarmonicRatioType = 
  | 'UNISON_1_1' 
  | 'OCTAVE_2_1' 
  | 'FIFTH_3_2' 
  | 'FOURTH_4_3' 
  | 'GOLDEN_PHI' 
  | 'EULER_E' 
  | 'TRITONE_SQRT2' 
  | 'NONE';

export interface HarmonicRatioLock {
  type: HarmonicRatioType;
  name: string;
  ratio: number;
  ratioA: number;
  ratioB: number;
  precision: number; // 0.0 to 1.0 (1.0 = exact mathematical lock)
  multiplier: number; // Score/Flux multiplier
  color: [number, number, number]; // RGB normalized
}

export type AnomalySpecies = 
  | 'gyroid_hydra' 
  | 'hopf_vortex' 
  | 'calabi_fold' 
  | 'mobius_rift' 
  | 'schwarzschild_core' 
  | 'tesseract_node' 
  | 'mandelbulb_fractal' 
  | 'omega_singularity';

export interface SingularityEntity {
  id: number;
  x: number;
  y: number;
  z: number;
  w: number;
  vx: number;
  vy: number;
  vz: number;
  vw: number;
  radius: number;
  frequency: number; // Natural resonance frequency
  species: AnomalySpecies;
  stability: number; // 0.0 (collapsing) to 1.0 (stable)
  maxStability: number;
  entropyGenerationRate: number;
  isAnchored: boolean;
  color: [number, number, number];
  wShadowIntensity: number; // How visible in current 3D slice based on gamma (0-1)
  connectedConduitCount: number;
  pulsePhase: number;
}

export interface ConduitLink {
  id: string;
  sourceId: number;
  targetId: number;
  tension: number; // 0 to 1
  resonanceHarmony: number; // 0 to 1
  energyFlow: number;
  activeTime: number;
  color: [number, number, number];
}

export interface PhotonicCrystal {
  id: number;
  x: number;
  y: number;
  z: number;
  w: number;
  energyValue: number;
  scale: number;
  lifespan: number;
  maxLifespan: number;
  color: [number, number, number];
}

export interface SectorConfig {
  id: number;
  name: string;
  subtitle: string;
  lore: string;
  difficulty: number;
  anomalySpecies: AnomalySpecies[];
  targetStability: number; // Target score to clear sector
  entropyRate: number; // Base rate at which global entropy accumulates
  initialManifold: {
    manifoldType: number; // 0=Gyroid, 1=Hopf, 2=CalabiYau, 3=Mobius, 4=Schwarzschild, 5=Tesseract, 6=Mandelbulb, 7=Omega
    surfaceDistortion: number;
    ambientColor: [number, number, number];
    glowColor: [number, number, number];
    fogDensity: number;
    gravitationalWarp: number;
  };
  unlockedByDefault: boolean;
}

export interface BestiaryEntry {
  species: AnomalySpecies;
  name: string;
  topologicalClassification: string;
  lore: string;
  dimensionalSignature: string;
  harmonicWeakness: string;
  encounteredCount: number;
  stabilizedCount: number;
}

export interface UpgradeNode {
  id: string;
  name: string;
  category: 'HARMONICS' | 'TETHER' | 'GRAVITY' | 'CHRONOS';
  description: string;
  level: number;
  maxLevel: number;
  costBase: number;
  costMultiplier: number;
  unlocked: boolean;
  effectValue: number;
  statDescription: (level: number) => string;
}

export interface SoundSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  binauralDrone: boolean;
  microtonalReverb: boolean;
}

export interface PlayerStats {
  chromaFlux: number; // In-game currency from stabilized crystals
  totalScore: number;
  highScore: number;
  totalStabilizations: number;
  highestCombo: number;
  sectorsCompleted: number[];
  unlockedUpgrades: Record<string, number>;
  unlockedBestiary: string[];
  totalPlaytimeSeconds: number;
}

export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  SECTOR_CLEAR = 'SECTOR_CLEAR',
  GAME_OVER = 'GAME_OVER',
  SANDBOX = 'SANDBOX'
}

export interface SandboxParameters {
  manifoldType: number;
  alpha: number;
  beta: number;
  gamma: number;
  surfaceDistortion: number;
  glowIntensity: number;
  gravitationalWarp: number;
  fogDensity: number;
  colorScheme: number; // 0=Cosmic Violet, 1=Cyan Nebula, 2=Solar Amber, 3=Emerald Void, 4=Monochrome Matrix
  particleSpeed: number;
  particleCount: number;
  lightOrbitSpeed: number;
}
