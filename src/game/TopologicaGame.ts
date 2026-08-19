/**
 * TOPOLOGICA: Master Game Loop & Topological Mechanics Engine
 */

import {
  GameState,
  HarmonicFrequencies,
  HarmonicRatioLock,
  SingularityEntity,
  ConduitLink,
  PhotonicCrystal,
  SectorConfig,
  PlayerStats,
  SandboxParameters,
  UpgradeNode,
  BestiaryEntry
} from './types';
import { SECTORS, BESTIARY_DATA, UPGRADE_NODES } from './SectorsData';
import { Math4D } from '../engine/Math4D';
import { harmonicAudioEngine } from '../audio/HarmonicAudioEngine';
import { GPUParticleSystem } from '../engine/GPUParticles';
import { storageService } from '../services/storageService';

export class TopologicaGame {
  public gameState: GameState = GameState.START;
  public currentSector: SectorConfig = SECTORS[0];
  public harmonics: HarmonicFrequencies = { alpha: 1.5, beta: 1.5, gamma: 0.0 };
  public harmonicLock: HarmonicRatioLock = {
    type: 'NONE',
    name: 'Harmonic Calibration Required',
    ratio: 1.0,
    ratioA: 1.5,
    ratioB: 1.5,
    precision: 0,
    multiplier: 1.0,
    color: [0.5, 0.5, 0.6]
  };

  public singularities: SingularityEntity[] = [];
  public conduits: ConduitLink[] = [];
  public crystals: PhotonicCrystal[] = [];
  public particleSystem: GPUParticleSystem = new GPUParticleSystem();

  // Metrics
  public score: number = 0;
  public combo: number = 0;
  public maxCombo: number = 0;
  public entropy: number = 0; // 0% to 100%
  public chromaFluxEarned: number = 0;
  public totalStabilizations: number = 0;

  // Player Stats & Upgrades
  public playerStats: PlayerStats = storageService.getPlayerStats();
  public upgrades: UpgradeNode[] = [...UPGRADE_NODES];
  public bestiary: BestiaryEntry[] = storageService.getBestiary();
  public sandboxParams: SandboxParameters = storageService.getSandboxParams();

  // Interaction State
  public dragSourceId: number | null = null;
  public dragCurrentPos: { x: number; y: number } | null = null;
  public lensActive: boolean = false;
  public mousePos: [number, number] = [0, 0];
  public cameraPos: [number, number, number] = [0.0, 0.0, 3.8];
  public cameraTarget: [number, number, number] = [0.0, 0.0, 0.0];

  // Loop Variables
  private lastTime: number = 0;
  private accumulator: number = 0;
  private readonly fixedStep: number = 1 / 60;
  private nextEntityId: number = 1;
  private nextConduitId: number = 1;
  private sectorTimeElapsed: number = 0;

  constructor() {
    this.syncUpgradesFromStats();
  }

  private syncUpgradesFromStats() {
    this.upgrades.forEach(u => {
      if (this.playerStats.unlockedUpgrades[u.id] !== undefined) {
        u.level = this.playerStats.unlockedUpgrades[u.id];
      }
    });
  }

  public getUpgradeLevel(id: string): number {
    return this.playerStats.unlockedUpgrades[id] || 0;
  }

  public getToleranceWindow(): number {
    const qLvl = this.getUpgradeLevel('res_q_factor');
    return 0.08 * (1 + qLvl * 0.15);
  }

  public getMaxConduits(): number {
    const bandLvl = this.getUpgradeLevel('tether_capacity');
    return 6 + bandLvl * 2;
  }

  public getLensRadius(): number {
    const lensLvl = this.getUpgradeLevel('lens_focus_radius');
    return 0.25 * (1 + lensLvl * 0.2);
  }

  public startSector(sectorId: number) {
    const sector = SECTORS.find(s => s.id === sectorId) || SECTORS[0];
    this.currentSector = sector;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.entropy = 10;
    this.chromaFluxEarned = 0;
    this.totalStabilizations = 0;
    this.sectorTimeElapsed = 0;
    this.conduits = [];
    this.crystals = [];
    this.singularities = [];
    this.dragSourceId = null;

    // Reset harmonics
    this.harmonics = { alpha: 1.5, beta: 1.5, gamma: 0.0 };
    this.updateHarmonicLock();

    // Spawn Initial Singularities
    const initialCount = 3 + Math.min(3, sector.difficulty);
    for (let i = 0; i < initialCount; i++) {
      this.spawnSingularity();
    }

    this.gameState = GameState.PLAYING;
    harmonicAudioEngine.resume();
  }

  public startSandbox() {
    this.gameState = GameState.SANDBOX;
    this.harmonics = {
      alpha: this.sandboxParams.alpha,
      beta: this.sandboxParams.beta,
      gamma: this.sandboxParams.gamma
    };
    this.updateHarmonicLock();
    this.conduits = [];
    this.crystals = [];
    this.singularities = [];
    for (let i = 0; i < 5; i++) {
      this.spawnSingularity();
    }
    harmonicAudioEngine.resume();
  }

  private spawnSingularity() {
    if (this.singularities.length >= 8) return;

    const sector = this.currentSector;
    const species = sector.anomalySpecies[Math.floor(Math.random() * sector.anomalySpecies.length)];
    const angle = Math.random() * Math.PI * 2;
    const dist = 0.5 + Math.random() * 1.3;

    // Determine colors
    let color: [number, number, number] = [0.4, 0.8, 1.0];
    if (species === 'hopf_vortex') color = [0.1, 0.9, 0.8];
    else if (species === 'calabi_fold') color = [0.8, 0.3, 0.95];
    else if (species === 'mobius_rift') color = [1.0, 0.5, 0.2];
    else if (species === 'schwarzschild_core') color = [1.0, 0.2, 0.1];
    else if (species === 'tesseract_node') color = [0.2, 1.0, 0.6];
    else if (species === 'mandelbulb_fractal') color = [0.95, 0.2, 0.7];
    else if (species === 'omega_singularity') color = [0.9, 0.9, 1.0];

    const sing: SingularityEntity = {
      id: this.nextEntityId++,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      z: (Math.random() - 0.5) * 0.8,
      w: (Math.random() - 0.5) * 1.5,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      vz: (Math.random() - 0.5) * 0.1,
      vw: (Math.random() - 0.5) * 0.2,
      radius: 0.22 + Math.random() * 0.08,
      frequency: 1.0 + Math.random() * 2.0,
      species,
      stability: 0.0,
      maxStability: 1.0,
      entropyGenerationRate: 0.4 + this.currentSector.difficulty * 0.15,
      isAnchored: false,
      color,
      wShadowIntensity: 1.0,
      connectedConduitCount: 0,
      pulsePhase: Math.random() * Math.PI * 2
    };

    this.singularities.push(sing);

    // Record bestiary encounter
    const entry = this.bestiary.find(b => b.species === species);
    if (entry) {
      entry.encounteredCount++;
      storageService.saveBestiary(this.bestiary);
    }
  }

  public setHarmonics(alpha?: number, beta?: number, gamma?: number) {
    if (alpha !== undefined) this.harmonics.alpha = Math4D.clamp(alpha, 0.5, 6.0);
    if (beta !== undefined) this.harmonics.beta = Math4D.clamp(beta, 0.5, 6.0);
    if (gamma !== undefined) {
      this.harmonics.gamma = (gamma + Math.PI * 2) % (Math.PI * 2);
      harmonicAudioEngine.playPhaseShift();
    }
    this.updateHarmonicLock();
  }

  private updateHarmonicLock() {
    this.harmonicLock = Math4D.evaluateHarmonicLock(this.harmonics, this.getToleranceWindow());
    harmonicAudioEngine.updateHarmonics(this.harmonics, this.harmonicLock, this.entropy);
  }

  public update(currentTime: number, screenWidth: number, screenHeight: number) {
    if (this.lastTime === 0) {
      this.lastTime = currentTime;
      return;
    }

    let frameTime = (currentTime - this.lastTime) / 1000;
    if (frameTime > 0.25) frameTime = 0.25;
    this.lastTime = currentTime;
    this.accumulator += frameTime;

    while (this.accumulator >= this.fixedStep) {
      this.fixedUpdate(this.fixedStep, screenWidth, screenHeight);
      this.accumulator -= this.fixedStep;
    }

    // Particle visuals update
    const lens3D = this.lensActive ? Math4D.unprojectScreenTo4D(this.mousePos[0], this.mousePos[1], screenWidth, screenHeight) : null;
    this.particleSystem.update(
      frameTime,
      currentTime * 0.001,
      this.harmonics,
      this.singularities,
      this.conduits,
      this.crystals,
      lens3D
    );
  }

  private fixedUpdate(dt: number, screenWidth: number, screenHeight: number) {
    if (this.gameState !== GameState.PLAYING && this.gameState !== GameState.SANDBOX) return;

    this.sectorTimeElapsed += dt;

    // 1. Accumulate Entropy in Campaign
    if (this.gameState === GameState.PLAYING) {
      const damperLvl = this.getUpgradeLevel('entropy_damping_field');
      const damperFactor = Math.max(0.4, 1.0 - damperLvl * 0.12);
      const baseEntropyGrowth = (this.currentSector.entropyRate * damperFactor) * dt * 0.4;
      
      // Unstable anomalies generate entropy
      let anomalyEntropy = 0;
      for (const s of this.singularities) {
        if (s.connectedConduitCount === 0) {
          anomalyEntropy += s.entropyGenerationRate * dt * 0.25;
        }
      }

      this.entropy = Math.min(100, this.entropy + baseEntropyGrowth + anomalyEntropy);

      // Check Game Over
      if (this.entropy >= 100) {
        this.gameState = GameState.GAME_OVER;
        return;
      }
    }

    // 2. Spawn Singularity if pool is depleted
    if (this.singularities.length < 3 && Math.random() < 0.02) {
      this.spawnSingularity();
    }

    // 3. Update Singularities
    const visc = Math.max(0.2, 1.0 / this.harmonics.beta);
    for (const s of this.singularities) {
      s.pulsePhase += dt * (2.0 + s.frequency);

      // 4D W-shadow calculation
      const rot = Math4D.rotateZW(Math4D.rotateXW({ x: s.x, y: s.y, z: s.z, w: s.w }, this.harmonics.gamma * 0.5), this.harmonics.gamma);
      s.wShadowIntensity = Math.max(0.15, 1.0 - Math.abs(rot.w) / 2.2);

      // Position update with viscosity damping
      s.x += s.vx * dt * visc;
      s.y += s.vy * dt * visc;
      s.z += s.vz * dt * visc;
      s.w += s.vw * dt * visc;

      // Soft spherical bounce in 4D space
      const dist = Math4D.length4D({ x: s.x, y: s.y, z: s.z, w: s.w });
      if (dist > 2.0) {
        s.vx *= -0.85;
        s.vy *= -0.85;
        s.vz *= -0.85;
        s.vw *= -0.85;
      }

      // Gravitational Lens pull if active
      if (this.lensActive) {
        const lens4D = Math4D.unprojectScreenTo4D(this.mousePos[0], this.mousePos[1], screenWidth, screenHeight);
        const dx = lens4D.x - s.x;
        const dy = lens4D.y - s.y;
        const d = Math.hypot(dx, dy);
        const lensRadius = this.getLensRadius() * 4.0;
        if (d < lensRadius && d > 0.05) {
          const pullLvl = this.getUpgradeLevel('singularity_anchor_pull');
          const pullForce = (0.6 * (1 + pullLvl * 0.3) * dt) / d;
          s.vx += dx * pullForce;
          s.vy += dy * pullForce;
        }
      }
    }

    // 4. Update Conduits and Transmit Harmonic Energy
    for (let i = this.conduits.length - 1; i >= 0; i--) {
      const c = this.conduits[i];
      c.activeTime += dt;

      const s1 = this.singularities.find(s => s.id === c.sourceId);
      const s2 = this.singularities.find(s => s.id === c.targetId);

      if (!s1 || !s2) {
        this.conduits.splice(i, 1);
        continue;
      }

      const dist = Math4D.distance4D(
        { x: s1.x, y: s1.y, z: s1.z, w: s1.w },
        { x: s2.x, y: s2.y, z: s2.z, w: s2.w }
      );

      c.tension = Math.min(1.0, dist / 2.5);

      // If player is in harmonic lock, charge stability
      if (this.harmonicLock.precision > 0.15) {
        const chargeRate = (0.4 + this.harmonicLock.precision * 0.8) * dt;
        s1.stability = Math.min(s1.maxStability, s1.stability + chargeRate);
        s2.stability = Math.min(s2.maxStability, s2.stability + chargeRate);
        c.resonanceHarmony = Math.min(1.0, c.resonanceHarmony + dt * 2.0);
      } else {
        c.resonanceHarmony = Math.max(0.0, c.resonanceHarmony - dt * 1.0);
      }
    }

    // 5. Check for Constructive Resonance Collapses
    this.checkConstructiveCollapses(screenWidth, screenHeight);

    // 6. Update Photonic Crystals
    for (let i = this.crystals.length - 1; i >= 0; i--) {
      const cr = this.crystals[i];
      cr.lifespan -= dt;
      if (cr.lifespan <= 0) {
        this.crystals.splice(i, 1);
      }
    }

    // 7. Check Sector Clear Condition
    if (this.gameState === GameState.PLAYING && this.score >= this.currentSector.targetStability) {
      this.triggerSectorClear();
    }
  }

  private checkConstructiveCollapses(screenWidth: number, screenHeight: number) {
    if (this.harmonicLock.precision < 0.35) return;

    // Find fully stabilized singularities
    const readyToCollapse = this.singularities.filter(s => s.stability >= 1.0);
    if (readyToCollapse.length === 0) return;

    for (const sing of readyToCollapse) {
      this.collapseSingularity(sing, screenWidth, screenHeight);
    }
  }

  public collapseSingularity(sing: SingularityEntity, screenWidth: number, screenHeight: number) {
    // 1. Calculate Multipliers & Score
    this.combo++;
    if (this.combo > this.maxCombo) this.maxCombo = this.combo;

    const phiLvl = this.getUpgradeLevel('golden_ratio_amplifier');
    let lockMult = this.harmonicLock.multiplier;
    if (this.harmonicLock.type === 'GOLDEN_PHI') {
      lockMult *= (1 + phiLvl * 0.5);
    }

    const basePts = 100 * this.currentSector.difficulty;
    const earnedScore = Math.round(basePts * lockMult * (1 + this.combo * 0.2));
    this.score += earnedScore;

    const yieldLvl = this.getUpgradeLevel('flux_multiplier');
    const fluxYield = Math.round((10 + this.currentSector.difficulty * 8) * (1 + yieldLvl * 0.25) * lockMult);
    this.chromaFluxEarned += fluxYield;
    this.playerStats.chromaFlux += fluxYield;
    this.totalStabilizations++;
    this.playerStats.totalStabilizations++;

    // Purge Entropy
    const entropyPurge = 12 + this.harmonicLock.precision * 10;
    this.entropy = Math.max(0, this.entropy - entropyPurge);

    // 2. Spawn Photonic Crystal
    this.crystals.push({
      id: this.nextEntityId++,
      x: sing.x,
      y: sing.y,
      z: sing.z,
      w: sing.w,
      energyValue: fluxYield,
      scale: 1.0,
      lifespan: 3.5,
      maxLifespan: 3.5,
      color: sing.color
    });

    // 3. Audio & Particle VFX
    harmonicAudioEngine.playResonanceCollapse(this.harmonicLock.precision, this.harmonicLock.name);
    this.particleSystem.emitCollapseBurst(sing.x, sing.y, sing.z, sing.color, 80);

    // 4. Record Bestiary Stabilization
    const entry = this.bestiary.find(b => b.species === sing.species);
    if (entry) {
      entry.stabilizedCount++;
      storageService.saveBestiary(this.bestiary);
    }

    // 5. Remove Singularity & Its Conduits
    this.conduits = this.conduits.filter(c => c.sourceId !== sing.id && c.targetId !== sing.id);
    this.singularities = this.singularities.filter(s => s.id !== sing.id);

    // Recompute connected counts
    this.singularities.forEach(s => {
      s.connectedConduitCount = this.conduits.filter(c => c.sourceId === s.id || c.targetId === s.id).length;
    });

    storageService.savePlayerStats(this.playerStats);
  }

  private triggerSectorClear() {
    this.gameState = GameState.SECTOR_CLEAR;
    harmonicAudioEngine.playSectorClear();

    // Unlock next sector
    const nextSectorId = this.currentSector.id + 1;
    if (!this.playerStats.sectorsCompleted.includes(this.currentSector.id)) {
      this.playerStats.sectorsCompleted.push(this.currentSector.id);
    }
    if (nextSectorId <= SECTORS.length && !this.playerStats.sectorsCompleted.includes(nextSectorId)) {
      this.playerStats.sectorsCompleted.push(nextSectorId);
    }

    if (this.score > this.playerStats.highScore) {
      this.playerStats.highScore = this.score;
    }
    this.playerStats.totalScore += this.score;
    storageService.savePlayerStats(this.playerStats);
  }

  // Pointer & Gesture Handlers
  public handlePointerDown(screenX: number, screenY: number, screenWidth: number, screenHeight: number, isRightClick: boolean = false) {
    this.mousePos = [screenX, screenY];

    if (isRightClick) {
      this.lensActive = true;
      return;
    }

    // Check if clicking near any visible singularity to start conduit tether
    const clickedSing = this.findSingularityAtScreen(screenX, screenY, screenWidth, screenHeight);
    if (clickedSing) {
      this.dragSourceId = clickedSing.id;
      this.dragCurrentPos = { x: screenX, y: screenY };
      harmonicAudioEngine.playTetherPluck(clickedSing.frequency, 0.3);
    } else {
      // Otherwise activate Gravitational Lens
      this.lensActive = true;
    }
  }

  public handlePointerMove(screenX: number, screenY: number) {
    this.mousePos = [screenX, screenY];
    if (this.dragSourceId !== null) {
      this.dragCurrentPos = { x: screenX, y: screenY };
    }
  }

  public handlePointerUp(screenX: number, screenY: number, screenWidth: number, screenHeight: number) {
    if (this.dragSourceId !== null) {
      const targetSing = this.findSingularityAtScreen(screenX, screenY, screenWidth, screenHeight);
      if (targetSing && targetSing.id !== this.dragSourceId) {
        this.createConduit(this.dragSourceId, targetSing.id);
      }
    }

    this.dragSourceId = null;
    this.dragCurrentPos = null;
    this.lensActive = false;
  }

  public createConduit(sourceId: number, targetId: number) {
    if (this.conduits.length >= this.getMaxConduits()) return;

    // Prevent duplicate
    const exists = this.conduits.some(
      c => (c.sourceId === sourceId && c.targetId === targetId) || (c.sourceId === targetId && c.targetId === sourceId)
    );
    if (exists) return;

    const s1 = this.singularities.find(s => s.id === sourceId);
    const s2 = this.singularities.find(s => s.id === targetId);
    if (!s1 || !s2) return;

    const conduit: ConduitLink = {
      id: `conduit_${this.nextConduitId++}`,
      sourceId,
      targetId,
      tension: 0.2,
      resonanceHarmony: 0.0,
      energyFlow: 0.5,
      activeTime: 0,
      color: [(s1.color[0] + s2.color[0]) * 0.5, (s1.color[1] + s2.color[1]) * 0.5, (s1.color[2] + s2.color[2]) * 0.5]
    };

    this.conduits.push(conduit);
    s1.connectedConduitCount++;
    s2.connectedConduitCount++;

    harmonicAudioEngine.playTetherPluck(s2.frequency, 0.8);
    this.particleSystem.emitConduitFlow(s1, s2, conduit.color);
  }

  private findSingularityAtScreen(
    screenX: number,
    screenY: number,
    screenWidth: number,
    screenHeight: number
  ): SingularityEntity | null {
    let closest: SingularityEntity | null = null;
    let minDist = 45; // Click radius in pixels

    for (const s of this.singularities) {
      const proj = Math4D.project4DtoScreen(
        { x: s.x, y: s.y, z: s.z, w: s.w },
        this.harmonics.gamma,
        screenWidth,
        screenHeight
      );

      if (!proj.visible || proj.wShadow < 0.2) continue;

      const d = Math.hypot(proj.x - screenX, proj.y - screenY);
      if (d < minDist) {
        minDist = d;
        closest = s;
      }
    }

    return closest;
  }

  public purchaseUpgrade(upgradeId: string): boolean {
    const upgrade = this.upgrades.find(u => u.id === upgradeId);
    if (!upgrade || upgrade.level >= upgrade.maxLevel) return false;

    const cost = Math.round(upgrade.costBase * Math.pow(upgrade.costMultiplier, upgrade.level));
    if (this.playerStats.chromaFlux < cost) return false;

    this.playerStats.chromaFlux -= cost;
    upgrade.level++;
    this.playerStats.unlockedUpgrades[upgradeId] = upgrade.level;

    // Check unlocks for dependent upgrades
    if (upgradeId === 'res_q_factor' && upgrade.level >= 2) {
      const golden = this.upgrades.find(u => u.id === 'golden_ratio_amplifier');
      if (golden) golden.unlocked = true;
    }
    if (upgradeId === 'tether_capacity' && upgrade.level >= 2) {
      const knot = this.upgrades.find(u => u.id === 'multi_knot_cascade');
      if (knot) knot.unlocked = true;
    }
    if (upgradeId === 'lens_focus_radius' && upgrade.level >= 2) {
      const anchor = this.upgrades.find(u => u.id === 'singularity_anchor_pull');
      if (anchor) anchor.unlocked = true;
    }
    if (upgradeId === 'entropy_damping_field' && upgrade.level >= 2) {
      const stasis = this.upgrades.find(u => u.id === 'temporal_stasis_burst');
      if (stasis) stasis.unlocked = true;
    }

    storageService.savePlayerStats(this.playerStats);
    return true;
  }
}
