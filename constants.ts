import { Biome, Skin, TrailTheme, TechUpgrade, DailyBounty, BestiaryEntry, Achievement, BossEntity } from './types';

export const GRAVITY = 0.52;
export const JUMP_STRENGTH = -9.2;
export const MAX_FALL_SPEED = 12.0;
export const BIRD_SIZE = 38;
export const PIPE_WIDTH = 64;
export const BASE_PIPE_GAP = 180;
export const MIN_PIPE_GAP = 135;
export const BASE_PIPE_SPEED = 3.2;
export const MAX_PIPE_SPEED = 6.8;
export const BASE_SPAWN_RATE = 110;
export const MIN_SPAWN_RATE = 65;

export const NEAR_MISS_DISTANCE = 32;
export const COMBO_TIMEOUT_FRAMES = 180;

export const POWERUP_DURATIONS = {
  shield: 999,
  slowmo: 6.0,
  magnet: 8.0,
  boost: 3.5
};

// 5 Dynamic Biomes
export const BIOMES: Biome[] = [
  {
    id: 'emerald_forest',
    name: 'Emerald Forest',
    minScore: 0,
    skyTop: '#0f172a',
    skyBottom: '#0284c7',
    mountainColor: '#064e3b',
    hillColor: '#047857',
    groundColor: '#065f46',
    groundAccent: '#10b981',
    pipeColorA: '#10b981',
    pipeColorB: '#047857',
    particleColor: '#34d399',
    ambientLight: 'rgba(52, 211, 153, 0.15)',
    weatherType: 'petals'
  },
  {
    id: 'cyberpunk_city',
    name: 'Neon Cyberpunk',
    minScore: 10,
    skyTop: '#18042c',
    skyBottom: '#4a044e',
    mountainColor: '#2e1065',
    hillColor: '#581c87',
    groundColor: '#3b0764',
    groundAccent: '#c026d3',
    pipeColorA: '#e879f9',
    pipeColorB: '#a21caf',
    particleColor: '#f43f5e',
    ambientLight: 'rgba(232, 121, 249, 0.2)',
    weatherType: 'cyber_rain'
  },
  {
    id: 'crystal_chasm',
    name: 'Crystalline Chasm',
    minScore: 25,
    skyTop: '#030712',
    skyBottom: '#1e1b4b',
    mountainColor: '#1e1b4b',
    hillColor: '#312e81',
    groundColor: '#1e1b4b',
    groundAccent: '#6366f1',
    pipeColorA: '#38bdf8',
    pipeColorB: '#0284c7',
    particleColor: '#67e8f9',
    ambientLight: 'rgba(56, 189, 248, 0.2)',
    weatherType: 'aurora_motes'
  },
  {
    id: 'magma_forge',
    name: 'Magma Forge',
    minScore: 45,
    skyTop: '#180303',
    skyBottom: '#450a0a',
    mountainColor: '#450a0a',
    hillColor: '#7f1d1d',
    groundColor: '#450a0a',
    groundAccent: '#ea580c',
    pipeColorA: '#f97316',
    pipeColorB: '#c2410c',
    particleColor: '#fbbf24',
    ambientLight: 'rgba(249, 115, 22, 0.25)',
    weatherType: 'embers'
  },
  {
    id: 'celestial_aurora',
    name: 'Celestial Aurora',
    minScore: 70,
    skyTop: '#020617',
    skyBottom: '#042f2e',
    mountainColor: '#042f2e',
    hillColor: '#134e4a',
    groundColor: '#042f2e',
    groundAccent: '#2dd4bf',
    pipeColorA: '#5eead4',
    pipeColorB: '#0f766e',
    particleColor: '#a7f3d0',
    ambientLight: 'rgba(94, 234, 212, 0.3)',
    weatherType: 'aurora_motes'
  }
];

// Colossal Boss Definitions
export const BOSS_ENCOUNTERS: Record<string, BossEntity> = {
  cyber_leviathan: {
    id: 'cyber_leviathan',
    name: 'Cyber Leviathan Dreadnought',
    maxHealth: 100,
    health: 100,
    x: 320,
    y: 250,
    targetY: 250,
    width: 90,
    height: 70,
    phase: 1,
    attackTimer: 0,
    laserCharge: 0,
    isFiringLaser: false,
    laserY: 250,
    color: '#e879f9',
    defeated: false
  },
  magma_golem: {
    id: 'magma_golem',
    name: 'Magma Core Behemoth',
    maxHealth: 160,
    health: 160,
    x: 320,
    y: 250,
    targetY: 250,
    width: 100,
    height: 80,
    phase: 1,
    attackTimer: 0,
    laserCharge: 0,
    isFiringLaser: false,
    laserY: 250,
    color: '#f97316',
    defeated: false
  }
};

// 10 Character Skins
export const SKINS: Skin[] = [
  { id: 'phoenix', name: 'Solar Phoenix', description: 'Blazes with golden solar fire and incandescent flight trails.', cost: 0, primaryColor: '#f59e0b', trailColor: '#ef4444', glowColor: '#fbbf24', emoji: '🔥', isUnlocked: true },
  { id: 'cyber_drone', name: 'Cyber Jet Drone', description: 'High-tech neon aerospace drone with pulse lasers.', cost: 40, primaryColor: '#06b6d4', trailColor: '#3b82f6', glowColor: '#38bdf8', emoji: '🛸', isUnlocked: false },
  { id: 'weed_leaf', name: 'Herb Leaf Hero', description: 'The legendary emerald weed flyer that drifts on clouds.', cost: 80, primaryColor: '#22c55e', trailColor: '#10b981', glowColor: '#4ade80', emoji: '🌿', isUnlocked: false },
  { id: 'void_reaper', name: 'Void Specter', description: 'A shadowy phantom from the abyss leaving dark matter trails.', cost: 120, primaryColor: '#a855f7', trailColor: '#c084fc', glowColor: '#e879f9', emoji: '🌌', isUnlocked: false },
  { id: 'golden_dragon', name: 'Celestial Dragon', description: 'Imperial mythical dragon shrouded in shimmering stardust.', cost: 200, primaryColor: '#eab308', trailColor: '#fbbf24', glowColor: '#fef08a', emoji: '🐲', isUnlocked: false },
  { id: 'hyper_mecha', name: 'Aegis Mech', description: 'Titanium exoskeleton with anti-gravity thrusters.', cost: 280, primaryColor: '#38bdf8', trailColor: '#818cf8', glowColor: '#67e8f9', emoji: '🤖', isUnlocked: false },
  { id: 'plasma_phoenix', name: 'Plasma Bird', description: 'Electric lightning creature radiating high-voltage ion arcs.', cost: 350, primaryColor: '#f43f5e', trailColor: '#fb7185', glowColor: '#fda4af', emoji: '⚡', isUnlocked: false },
  { id: 'cosmic_nebula', name: 'Starlight Siren', description: 'Ethereal celestial being composed of spinning quasars.', cost: 450, primaryColor: '#8b5cf6', trailColor: '#a78bfa', glowColor: '#c4b5fd', emoji: '✨', isUnlocked: false },
  { id: 'cyber_bat', name: 'Neon Shadow Bat', description: 'Sonic stealth bat navigating through radar sonar pulses.', cost: 550, primaryColor: '#10b981', trailColor: '#06b6d4', glowColor: '#34d399', emoji: '🦇', isUnlocked: false },
  { id: 'god_emperor', name: 'Eclipse Sovereign', description: 'The ultimate master of the sky crowned in pure superluminal light.', cost: 800, primaryColor: '#facc15', trailColor: '#f97316', glowColor: '#ffffff', emoji: '👑', isUnlocked: false }
];

// 6 Trail Themes
export const TRAIL_THEMES: TrailTheme[] = [
  { id: 'solar_flare', name: 'Solar Flare', colors: ['#f59e0b', '#ef4444'], cost: 0, isUnlocked: true, particleShape: 'circle' },
  { id: 'cyber_matrix', name: 'Cyber Matrix', colors: ['#06b6d4', '#3b82f6'], cost: 50, isUnlocked: false, particleShape: 'spark' },
  { id: 'stardust_rainbow', name: 'Stardust Rainbow', colors: ['#f43f5e', '#a855f7', '#38bdf8'], cost: 100, isUnlocked: false, particleShape: 'star' },
  { id: 'emerald_aurora', name: 'Emerald Aurora', colors: ['#10b981', '#34d399'], cost: 150, isUnlocked: false, particleShape: 'circle' },
  { id: 'void_singularity', name: 'Void Singularity', colors: ['#7c3aed', '#c084fc'], cost: 220, isUnlocked: false, particleShape: 'spark' },
  { id: 'supernova_gold', name: 'Supernova Gold', colors: ['#eab308', '#ffffff'], cost: 300, isUnlocked: false, particleShape: 'star' }
];

// 6-Tier Tech Research Upgrades
export const TECH_UPGRADES: TechUpgrade[] = [
  { id: 'shield_tech', name: 'Kinetic Shield Overclock', description: 'Strengthens kinetic shield recharge rate and absorbs extra damage.', currentLevel: 1, maxLevel: 5, baseCost: 40, costMultiplier: 1.8, icon: '🛡️', statBonusText: '+1 Max Shield Charge' },
  { id: 'slowmo_tech', name: 'Chrono Warp Engine', description: 'Extends time dilation duration and reduces game speed further.', currentLevel: 1, maxLevel: 5, baseCost: 35, costMultiplier: 1.6, icon: '⏱️', statBonusText: '+1.2s Slow-Mo Duration' },
  { id: 'magnet_tech', name: 'Quantum Magnetron', description: 'Widens magnetic field radius to vacuum coins across screen.', currentLevel: 1, maxLevel: 5, baseCost: 30, costMultiplier: 1.5, icon: '🧲', statBonusText: '+40px Magnetic Pull Radius' },
  { id: 'boost_tech', name: 'Hyper Thruster', description: 'Increases hyperspace rocket velocity and smash shockwave radius.', currentLevel: 1, maxLevel: 5, baseCost: 50, costMultiplier: 2.0, icon: '🚀', statBonusText: '+20% Boost Speed & Area' },
  { id: 'graze_tech', name: 'Graze Matrix Core', description: 'Expands graze trigger window and boosts combo multiplier points.', currentLevel: 1, maxLevel: 5, baseCost: 45, costMultiplier: 1.7, icon: '⚡', statBonusText: '+8px Graze Window & +1x Multiplier' },
  { id: 'stardust_tech', name: 'Stardust Harvester', description: 'Enhances gold coin drop rate and grants bonus coin payouts.', currentLevel: 1, maxLevel: 5, baseCost: 60, costMultiplier: 2.2, icon: '🪙', statBonusText: '+50% Gold Coin Value' }
];

// Daily Bounties
export const DAILY_BOUNTIES: DailyBounty[] = [
  { id: 'bounty_score', title: 'Altitude Record', description: 'Reach a score of 30 in any single flight run.', target: 30, progress: 0, rewardCoins: 60, completed: false, icon: '🎯' },
  { id: 'bounty_graze', title: 'Daredevil Streak', description: 'Execute 15 close near-miss grazes.', target: 15, progress: 0, rewardCoins: 80, completed: false, icon: '⚡' },
  { id: 'bounty_coins', title: 'Stardust Hoarder', description: 'Collect 20 gold coins across your runs.', target: 20, progress: 0, rewardCoins: 75, completed: false, icon: '🪙' }
];

// Bestiary Lore Logs
export const BESTIARY: BestiaryEntry[] = [
  { id: 'bio_forest', title: 'Emerald Canopy', subtitle: 'Zone 1 Environment', description: 'A vibrant primeval woodland overgrown with colossal crystalline monoliths.', lore: 'The crystals have pulsed with solar energy for thousands of years, guiding avian explorers.', stats: { 'Hazard Rating': 'Low', 'Atmosphere': 'Rich Oxygen', 'Native Minerals': 'Chlorophyll Quartz' }, icon: '🌲', unlocked: true },
  { id: 'bio_cyber', title: 'Neon Cyber Metropolis', subtitle: 'Zone 2 Environment', description: 'A towering cyberpunk skyline of laser highways and electromagnetic power grids.', lore: 'Constructed by an ancient synth guild, the city continues to pulse with automated defense lasers.', stats: { 'Hazard Rating': 'Moderate', 'Atmosphere': 'Neon Ionized', 'Native Minerals': 'Superconductors' }, icon: '🌆', unlocked: true },
  { id: 'bio_chasm', title: 'Crystalline Chasm', subtitle: 'Zone 3 Environment', description: 'A subterranean cavern of colossal sapphire stalactites and zero-gravity rifts.', lore: 'The crystals resonate at harmonic frequencies that bend light and create sonic echoes.', stats: { 'Hazard Rating': 'High', 'Atmosphere': 'Sub-zero Vacuum', 'Native Minerals': 'Resonant Sapphire' }, icon: '💎', unlocked: false },
  { id: 'boss_leviathan', title: 'Cyber Leviathan', subtitle: 'Colossal Mechanical Boss', description: 'A dreadnought automated war machine patrolling the stratosphere with high-yield laser cannons.', lore: 'Originally built as a planetary defense platform, it now tests the reflex of any pilot daring to breach the core.', stats: { 'Hull Armor': '100 MW Titanium', 'Weaponry': 'Dual Hyper-Beams', 'Threat Class': 'Omega' }, icon: '👾', unlocked: true },
  { id: 'boss_magma', title: 'Magma Core Golem', subtitle: 'Volcanic Elemental Boss', description: 'A molten entity forged in the geothermal depths that hurls volcanic boulders and lava waves.', lore: 'Born from tectonic cataclysms, its obsidian fists crack the very fabric of space.', stats: { 'Core Temp': '8,500 °C', 'Weaponry': 'Molten Eruptions', 'Threat Class': 'Titan' }, icon: '🌋', unlocked: false }
];

// Achievements
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_flight', title: 'First Flight', description: 'Score your first 5 points in a single run.', rewardCoins: 20, unlocked: false, progress: 0, maxProgress: 5, icon: '🪶' },
  { id: 'graze_master', title: 'Daredevil Grazing', description: 'Execute 10 near-miss grazes.', rewardCoins: 40, unlocked: false, progress: 0, maxProgress: 10, icon: '⚡' },
  { id: 'fever_streak', title: 'Combo Maestro', description: 'Achieve a 5x combo multiplier.', rewardCoins: 60, unlocked: false, progress: 0, maxProgress: 5, icon: '🔥' },
  { id: 'shield_bearer', title: 'Invulnerable', description: 'Absorb a lethal obstacle hit using the Kinetic Shield.', rewardCoins: 50, unlocked: false, progress: 0, maxProgress: 1, icon: '🛡️' },
  { id: 'century_pilot', title: 'Century Pilot', description: 'Score 50 points in a single run.', rewardCoins: 150, unlocked: false, progress: 0, maxProgress: 50, icon: '👑' },
  { id: 'boss_slayer', title: 'Leviathan Slayer', description: 'Defeat the Cyber Leviathan in Boss Raid Mode.', rewardCoins: 250, unlocked: false, progress: 0, maxProgress: 1, icon: '⚔️' },
  { id: 'wormhole_traveler', title: 'Hyperspace Traveler', description: 'Enter the 3D Raymarched SDF Wormhole dimension.', rewardCoins: 100, unlocked: false, progress: 0, maxProgress: 1, icon: '🌀' }
];