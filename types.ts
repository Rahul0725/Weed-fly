export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  WORMHOLE_STAGE = 'WORMHOLE_STAGE',
  GAME_OVER = 'GAME_OVER'
}

export type GameMode = 'arcade' | 'boss_raid' | 'time_dash' | 'graze_master';

export type PowerUpType = 'shield' | 'slowmo' | 'magnet' | 'boost';

export interface PowerUp {
  id: number;
  type: PowerUpType;
  x: number;
  y: number;
  radius: number;
  collected: boolean;
  pulsePhase: number;
}

export interface ActivePowerUp {
  type: PowerUpType;
  durationLeft: number;
  maxDuration: number;
}

export interface CoinOrb {
  id: number;
  x: number;
  y: number;
  radius: number;
  collected: boolean;
  value: number;
  pulsePhase: number;
}

export interface WarpPortal {
  id: number;
  x: number;
  y: number;
  radius: number;
  passed: boolean;
  rotation: number;
}

export interface PipeData {
  id: number;
  x: number;
  topHeight: number;
  gap: number;
  passed: boolean;
  imgIndex?: number;
  hasPassedGraze?: boolean;
  powerUp?: PowerUp;
  coin?: CoinOrb;
  warpPortal?: WarpPortal;
  type: 'standard' | 'moving' | 'crystal_gate' | 'laser_gate';
  oscillationPhase?: number;
  initialTopHeight?: number;
}

export interface BossEntity {
  id: string;
  name: string;
  maxHealth: number;
  health: number;
  x: number;
  y: number;
  targetY: number;
  width: number;
  height: number;
  phase: number;
  attackTimer: number;
  laserCharge: number; // 0 to 1
  isFiringLaser: boolean;
  laserY: number;
  color: string;
  defeated: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  shape?: 'circle' | 'spark' | 'ring' | 'crystal' | 'star' | 'petal' | 'ember';
  rotation?: number;
  rotSpeed?: number;
  gravity?: number;
}

export interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  scale: number;
}

export interface Biome {
  id: string;
  name: string;
  minScore: number;
  skyTop: string;
  skyBottom: string;
  mountainColor: string;
  hillColor: string;
  groundColor: string;
  groundAccent: string;
  pipeColorA: string;
  pipeColorB: string;
  particleColor: string;
  ambientLight: string;
  weatherType?: 'petals' | 'cyber_rain' | 'embers' | 'aurora_motes' | 'none';
}

export interface Skin {
  id: string;
  name: string;
  description: string;
  cost: number;
  primaryColor: string;
  trailColor: string;
  glowColor: string;
  emoji: string;
  imageUrl?: string;
  isUnlocked: boolean;
}

export interface TrailTheme {
  id: string;
  name: string;
  colors: string[];
  cost: number;
  isUnlocked: boolean;
  particleShape: 'circle' | 'spark' | 'star';
}

export interface TechUpgrade {
  id: string;
  name: string;
  description: string;
  currentLevel: number;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  icon: string;
  statBonusText: string;
}

export interface DailyBounty {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  rewardCoins: number;
  completed: boolean;
  icon: string;
}

export interface BestiaryEntry {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  lore: string;
  stats: Record<string, string>;
  icon: string;
  unlocked: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  icon: string;
}

export interface GhostPoint {
  t: number;
  y: number;
  v: number;
}

export interface RunStatistics {
  score: number;
  coinsCollected: number;
  nearMisses: number;
  maxCombo: number;
  powerUpsUsed: number;
  timeSurvivedSeconds: number;
  newHighScore: boolean;
  bossDefeated?: boolean;
}

export interface SoundSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  muted: boolean;
}