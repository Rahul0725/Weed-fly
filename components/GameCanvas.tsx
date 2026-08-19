import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  GRAVITY,
  JUMP_STRENGTH,
  MAX_FALL_SPEED,
  BIRD_SIZE,
  PIPE_WIDTH,
  BASE_PIPE_GAP,
  MIN_PIPE_GAP,
  BASE_PIPE_SPEED,
  MAX_PIPE_SPEED,
  BASE_SPAWN_RATE,
  MIN_SPAWN_RATE,
  NEAR_MISS_DISTANCE,
  COMBO_TIMEOUT_FRAMES,
  POWERUP_DURATIONS,
  BIOMES,
  BOSS_ENCOUNTERS
} from '../constants';
import {
  GameState,
  GameMode,
  PipeData,
  PowerUp,
  PowerUpType,
  ActivePowerUp,
  CoinOrb,
  WarpPortal,
  Biome,
  Skin,
  TrailTheme,
  TechUpgrade,
  DailyBounty,
  BestiaryEntry,
  Achievement,
  RunStatistics,
  SoundSettings,
  BossEntity
} from '../types';
import { audioController } from '../utils/audio';
import { ParticleSystem } from '../utils/particles';
import { CameraTrauma, circleIntersectBox, distance, clamp } from '../utils/math';
import { gameRenderer } from './GameRenderer';
import { storageService } from '../services/storageService';
import { getGameCommentary } from '../services/geminiService';
import { gamepadController } from '../utils/gamepad';
import { ghostTelemetry } from '../utils/ghostTelemetry';
import { raymarchSDFStage } from '../utils/raymarch3d';

import { HUD } from './UI/HUD';
import { StartScreen } from './UI/StartScreen';
import { GameOverModal } from './UI/GameOverModal';
import { PauseModal } from './UI/PauseModal';
import { ShopModal } from './UI/ShopModal';
import { SkillTreeModal } from './UI/SkillTreeModal';
import { BountiesModal } from './UI/BountiesModal';
import { AchievementsModal } from './UI/AchievementsModal';

const GameCanvas: React.FC = () => {
  // --- Game Lifecycle States ---
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [gameMode, setGameMode] = useState<GameMode>('arcade');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [combo, setCombo] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [currentBiome, setCurrentBiome] = useState<Biome>(BIOMES[0]);
  const [activePowerUps, setActivePowerUps] = useState<ActivePowerUp[]>([]);
  const [activeBoss, setActiveBoss] = useState<BossEntity | null>(null);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 400,
    height: typeof window !== 'undefined' ? window.innerHeight : 700
  });
  const [isGamepadConnected, setIsGamepadConnected] = useState(false);

  // UI Modal States
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isTechTreeOpen, setIsTechTreeOpen] = useState(false);
  const [isBountiesOpen, setIsBountiesOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [aiCommentary, setAiCommentary] = useState('');

  // Storage Synced States
  const [soundSettings, setSoundSettings] = useState<SoundSettings>(storageService.getSoundSettings());
  const [skins, setSkins] = useState<Skin[]>(storageService.getSkins());
  const [trailThemes, setTrailThemes] = useState<TrailTheme[]>(storageService.getTrailThemes());
  const [equippedSkinId, setEquippedSkinId] = useState<string>(storageService.getEquippedSkinId());
  const [equippedTrailId, setEquippedTrailId] = useState<string>(storageService.getEquippedTrailId());
  const [techUpgrades, setTechUpgrades] = useState<TechUpgrade[]>(storageService.getTechUpgrades());
  const [bounties, setBounties] = useState<DailyBounty[]>(storageService.getDailyBounties());
  const [bestiary, setBestiary] = useState<BestiaryEntry[]>(storageService.getBestiary());
  const [achievements, setAchievements] = useState<Achievement[]>(storageService.getAchievements());

  // Run Stats
  const runStatsRef = useRef<RunStatistics>({
    score: 0,
    coinsCollected: 0,
    nearMisses: 0,
    maxCombo: 0,
    powerUpsUsed: 0,
    timeSurvivedSeconds: 0,
    newHighScore: false
  });

  // --- Engine & Canvas Refs ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const particleSystem = useRef(new ParticleSystem());
  const cameraTrauma = useRef(new CameraTrauma());

  // Mutable Physics Refs
  const birdY = useRef(dimensions.height / 2);
  const birdVelocity = useRef(0);
  const pipes = useRef<PipeData[]>([]);
  const scrollX = useRef(0);
  const frameCount = useRef(0);
  const framesSinceSpawn = useRef(BASE_SPAWN_RATE);
  const comboFramesLeft = useRef(0);
  const activePowerUpsRef = useRef<ActivePowerUp[]>([]);
  const activeBossRef = useRef<BossEntity | null>(null);
  const runStartTime = useRef(0);

  // Load Saved Game Data & Ghost on Mount
  useEffect(() => {
    setHighScore(storageService.getHighScore());
    setCoins(storageService.getCoins());
    setSkins(storageService.getSkins());
    setTrailThemes(storageService.getTrailThemes());
    setEquippedSkinId(storageService.getEquippedSkinId());
    setEquippedTrailId(storageService.getEquippedTrailId());
    setTechUpgrades(storageService.getTechUpgrades());
    setBounties(storageService.getDailyBounties());
    setBestiary(storageService.getBestiary());
    setAchievements(storageService.getAchievements());
    ghostTelemetry.loadBestRun();

    const initialSound = storageService.getSoundSettings();
    setSoundSettings(initialSound);
    audioController.setSettings(initialSound);
  }, []);

  // Resize Handler
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setDimensions({
          width: window.innerWidth || 400,
          height: window.innerHeight || 700
        });
      }, 100);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const equippedSkin = skins.find(s => s.id === equippedSkinId) || skins[0];
  const equippedTrail = trailThemes.find(t => t.id === equippedTrailId) || trailThemes[0];

  // Helper: Start Run
  const startGame = useCallback(() => {
    audioController.resume();
    audioController.setLowPass(20000);
    audioController.startMusic();
    ghostTelemetry.startRecording();

    birdY.current = dimensions.height * 0.45;
    birdVelocity.current = JUMP_STRENGTH * 0.65;
    pipes.current = [];
    scrollX.current = 0;
    frameCount.current = 0;
    framesSinceSpawn.current = -120; // 3-second clear runway before first pipe
    comboFramesLeft.current = 0;
    activePowerUpsRef.current = [];
    setActivePowerUps([]);
    particleSystem.current.clear();
    particleSystem.current.emitFloatingText("TAP TO FLY! ✈️", dimensions.width / 2, dimensions.height * 0.35, "#38bdf8", 1.8);
    runStartTime.current = performance.now();

    if (gameMode === 'boss_raid') {
      const boss = { ...BOSS_ENCOUNTERS.cyber_leviathan, health: BOSS_ENCOUNTERS.cyber_leviathan.maxHealth };
      activeBossRef.current = boss;
      setActiveBoss(boss);
    } else {
      activeBossRef.current = null;
      setActiveBoss(null);
    }

    runStatsRef.current = {
      score: 0,
      coinsCollected: 0,
      nearMisses: 0,
      maxCombo: 0,
      powerUpsUsed: 0,
      timeSurvivedSeconds: 0,
      newHighScore: false
    };

    setScore(0);
    setCombo(0);
    setMultiplier(1);
    setCurrentBiome(BIOMES[0]);
    setGameState(GameState.PLAYING);
  }, [dimensions.height, gameMode]);

  // Jump Action
  const jump = useCallback(() => {
    if (gameState === GameState.PLAYING) {
      birdVelocity.current = JUMP_STRENGTH;
      audioController.playJump();
      gamepadController.triggerHaptic(0.2, 0.4, 70);

      const birdX = 65;
      particleSystem.current.emitBurst(birdX - 6, birdY.current + BIRD_SIZE / 2, 4, equippedTrail.colors[0], 0.6);
    } else if (gameState === GameState.WORMHOLE_STAGE) {
      birdVelocity.current = JUMP_STRENGTH * 0.8;
      audioController.playJump();
    } else if (gameState === GameState.START) {
      startGame();
    }
  }, [gameState, startGame, equippedTrail]);

  // Trigger Game Over
  const triggerGameOver = useCallback(async () => {
    setGameState(GameState.GAME_OVER);
    audioController.playCrash();
    audioController.stopMusic();
    audioController.setLowPass(800);
    cameraTrauma.current.addTrauma(0.85);
    gamepadController.triggerHaptic(0.6, 1.0, 300);

    const birdX = 65 + BIRD_SIZE / 2;
    const birdYPos = birdY.current + BIRD_SIZE / 2;
    particleSystem.current.emitShockwave(birdX, birdYPos, 140, '#f43f5e');
    particleSystem.current.emitBurst(birdX, birdYPos, 35, '#fbbf24', 2.0);

    const finalScore = runStatsRef.current.score;
    const currentHigh = storageService.getHighScore();
    const isNewHigh = finalScore > currentHigh;
    if (isNewHigh) {
      storageService.saveHighScore(finalScore);
      setHighScore(finalScore);
      runStatsRef.current.newHighScore = true;
    }

    ghostTelemetry.saveIfBest(finalScore, currentHigh);

    const stardustLevel = techUpgrades.find(u => u.id === 'stardust_tech')?.currentLevel || 1;
    const coinBonusMultiplier = 1 + (stardustLevel - 1) * 0.5;
    const finalEarnedCoins = Math.round(runStatsRef.current.coinsCollected * coinBonusMultiplier);

    const updatedCoins = storageService.addCoins(finalEarnedCoins);
    setCoins(updatedCoins);

    const updatedBounties = bounties.map(b => {
      if (b.id === 'bounty_score') b.progress = Math.max(b.progress, finalScore);
      if (b.id === 'bounty_graze') b.progress += runStatsRef.current.nearMisses;
      if (b.id === 'bounty_coins') b.progress += runStatsRef.current.coinsCollected;
      if (b.progress >= b.target && !b.completed) {
        b.completed = true;
        storageService.addCoins(b.rewardCoins);
      }
      return b;
    });
    storageService.saveDailyBounties(updatedBounties);
    setBounties(updatedBounties);

    const updatedAchievements = [...achievements];
    let achievementUnlocked = false;

    updatedAchievements.forEach(a => {
      if (a.id === 'first_flight' && finalScore >= 5) {
        a.progress = Math.max(a.progress, finalScore);
        if (!a.unlocked && a.progress >= a.maxProgress) { a.unlocked = true; achievementUnlocked = true; }
      }
      if (a.id === 'graze_master') {
        a.progress += runStatsRef.current.nearMisses;
        if (!a.unlocked && a.progress >= a.maxProgress) { a.unlocked = true; achievementUnlocked = true; }
      }
      if (a.id === 'fever_streak' && runStatsRef.current.maxCombo >= 5) {
        a.progress = Math.max(a.progress, runStatsRef.current.maxCombo);
        if (!a.unlocked && a.progress >= a.maxProgress) { a.unlocked = true; achievementUnlocked = true; }
      }
      if (a.id === 'century_pilot' && finalScore >= 50) {
        a.progress = Math.max(a.progress, finalScore);
        if (!a.unlocked && a.progress >= a.maxProgress) { a.unlocked = true; achievementUnlocked = true; }
      }
      if (a.id === 'boss_slayer' && runStatsRef.current.bossDefeated) {
        a.progress = 1;
        if (!a.unlocked) { a.unlocked = true; achievementUnlocked = true; }
      }
    });

    if (achievementUnlocked) {
      storageService.saveAchievements(updatedAchievements);
      setAchievements(updatedAchievements);
    }

    getGameCommentary(finalScore).then(commentary => {
      setAiCommentary(commentary);
    });
  }, [achievements, bounties, techUpgrades]);

  // Main Fixed Timestep Game Loop
  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    gamepadController.poll(jump, () => {
      if (gameState === GameState.PLAYING) setGameState(GameState.PAUSED);
      else if (gameState === GameState.PAUSED) setGameState(GameState.PLAYING);
    });
    setIsGamepadConnected(gamepadController.getIsConnected());

    const dpr = window.devicePixelRatio || 1;
    const { width, height } = dimensions;
    const targetW = Math.floor(width * dpr);
    const targetH = Math.floor(height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
      ctx.scale(dpr, dpr);
    } else {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const dt = 1 / 60;
    const time = performance.now() * 0.001;

    // --- IDLE / START MENU ANIMATION ---
    if (gameState === GameState.START) {
      scrollX.current += 1.2;
      birdY.current = (height / 2) + Math.sin(time * 3) * 10;
      birdVelocity.current = Math.cos(time * 3) * 1.5;
      particleSystem.current.updateWeather(currentBiome, width, height, dt);
    }

    // --- WORMHOLE BONUS STAGE LOOP ---
    if (gameState === GameState.WORMHOLE_STAGE) {
      birdVelocity.current = Math.min(birdVelocity.current + GRAVITY * 0.5, MAX_FALL_SPEED);
      birdY.current += birdVelocity.current;
      birdY.current = clamp(birdY.current, 50, height - 100);

      const stillRunning = raymarchSDFStage.update(dt, 65, birdY.current);
      raymarchSDFStage.render(ctx, width, height, time, 65, birdY.current);

      gameRenderer.renderPlayer(ctx, 65, birdY.current, birdVelocity.current, equippedSkin, [], time);

      if (!stillRunning) {
        const stars = raymarchSDFStage.totalCoinsGathered;
        runStatsRef.current.coinsCollected += stars;
        setCoins(c => c + stars);
        setGameState(GameState.PLAYING);
        audioController.playPowerUpCollect();
      }

      requestRef.current = requestAnimationFrame(loop);
      return;
    }

    // --- GAMEPLAY UPDATE STEP ---
    if (gameState === GameState.PLAYING) {
      const isSlowMo = activePowerUpsRef.current.some(p => p.type === 'slowmo');
      const isBoost = activePowerUpsRef.current.some(p => p.type === 'boost');
      const hasMagnet = activePowerUpsRef.current.some(p => p.type === 'magnet');
      const modeSpeedScale = gameMode === 'time_dash' ? 1.4 : 1.0;
      const timeScale = (isSlowMo ? 0.45 : isBoost ? 1.4 : 1.0) * modeSpeedScale;

      for (let i = activePowerUpsRef.current.length - 1; i >= 0; i--) {
        const ap = activePowerUpsRef.current[i];
        if (ap.type !== 'shield') {
          ap.durationLeft -= dt;
          if (ap.durationLeft <= 0) {
            activePowerUpsRef.current.splice(i, 1);
            if (ap.type === 'slowmo') audioController.setLowPass(20000);
          }
        }
      }
      setActivePowerUps([...activePowerUpsRef.current]);

      const currentScore = runStatsRef.current.score;
      const currentSpeed = clamp(BASE_PIPE_SPEED + currentScore * 0.06, BASE_PIPE_SPEED, MAX_PIPE_SPEED) * timeScale;
      const currentGap = Math.max(MIN_PIPE_GAP, BASE_PIPE_GAP - currentScore * 0.8);
      const currentSpawnRate = Math.max(MIN_SPAWN_RATE, BASE_SPAWN_RATE - Math.floor(currentScore * 0.7));

      scrollX.current += currentSpeed;

      birdVelocity.current = Math.min(birdVelocity.current + GRAVITY * timeScale, MAX_FALL_SPEED);
      birdY.current += birdVelocity.current * timeScale;

      const birdX = 65;
      const birdRadius = BIRD_SIZE / 2;

      const elapsedSec = (performance.now() - runStartTime.current) * 0.001;
      ghostTelemetry.recordTick(elapsedSec, birdY.current, birdVelocity.current);

      particleSystem.current.emitTrail(birdX + 2, birdY.current + birdRadius, equippedTrail.colors[0], birdVelocity.current);
      particleSystem.current.updateWeather(currentBiome, width, height, dt);

      const targetBiome = [...BIOMES].reverse().find(b => currentScore >= b.minScore) || BIOMES[0];
      if (targetBiome.id !== currentBiome.id) {
        setCurrentBiome(targetBiome);
        particleSystem.current.emitFloatingText(`ZONE: ${targetBiome.name}`, width / 2, height * 0.35, targetBiome.groundAccent, 1.3);
      }

      if (activeBossRef.current && !activeBossRef.current.defeated) {
        const boss = activeBossRef.current;
        boss.x = width - 120;
        boss.targetY = birdY.current;
        boss.y += (boss.targetY - boss.y) * 0.03;

        boss.attackTimer += dt;
        if (boss.attackTimer > 3.0 && boss.attackTimer < 4.5) {
          boss.laserCharge = (boss.attackTimer - 3.0) / 1.5;
        } else if (boss.attackTimer >= 4.5 && boss.attackTimer < 6.0) {
          boss.isFiringLaser = true;
          boss.laserCharge = 1.0;
          boss.laserY = boss.y;

          if (Math.abs(birdY.current + birdRadius - boss.laserY) < 22) {
            triggerGameOver();
            return;
          }
        } else if (boss.attackTimer >= 6.0) {
          boss.isFiringLaser = false;
          boss.laserCharge = 0;
          boss.attackTimer = 0;
        }
      }

      if (framesSinceSpawn.current >= currentSpawnRate) {
        const minPipeH = 50;
        const groundH = 48;
        const maxPipeH = height - currentGap - minPipeH - groundH;
        const safeMax = Math.max(minPipeH + 10, maxPipeH);
        const topH = Math.floor(Math.random() * (safeMax - minPipeH + 1)) + minPipeH;

        const coinY = topH + currentGap / 2;
        const coin: CoinOrb = {
          id: Date.now() + Math.random(),
          x: width + PIPE_WIDTH / 2,
          y: coinY,
          radius: 11,
          collected: false,
          value: 1,
          pulsePhase: 0
        };

        let warpPortal: WarpPortal | undefined = undefined;
        if (Math.random() < 0.08 && currentScore >= 5) {
          warpPortal = {
            id: Date.now() + 50,
            x: width + PIPE_WIDTH / 2,
            y: coinY,
            radius: 20,
            passed: false,
            rotation: 0
          };
        }

        let powerUp: PowerUp | undefined = undefined;
        if (Math.random() < 0.28) {
          const powerTypes: PowerUpType[] = ['shield', 'slowmo', 'magnet', 'boost'];
          const pickedType = powerTypes[Math.floor(Math.random() * powerTypes.length)];
          powerUp = {
            id: Date.now() + 100,
            x: width + PIPE_WIDTH / 2,
            y: coinY + (Math.random() * 30 - 15),
            radius: 15,
            type: pickedType,
            collected: false,
            pulsePhase: 0
          };
        }

        pipes.current.push({
          id: Date.now(),
          x: width,
          topHeight: topH,
          gap: currentGap,
          passed: false,
          type: 'standard',
          coin,
          powerUp,
          warpPortal
        });

        framesSinceSpawn.current = 0;
      }
      framesSinceSpawn.current++;

      for (let i = pipes.current.length - 1; i >= 0; i--) {
        const pipe = pipes.current[i];
        pipe.x -= currentSpeed;

        const bottomY = pipe.topHeight + pipe.gap;
        const bottomH = height - bottomY;

        if (pipe.warpPortal && !pipe.warpPortal.passed) {
          if (distance(birdX + birdRadius, birdY.current + birdRadius, pipe.warpPortal.x, pipe.warpPortal.y) < birdRadius + pipe.warpPortal.radius) {
            pipe.warpPortal.passed = true;
            raymarchSDFStage.startStage();
            setGameState(GameState.WORMHOLE_STAGE);
            audioController.playPowerUpCollect();
            return;
          }
        }

        if (pipe.coin && !pipe.coin.collected) {
          const magnetLevel = techUpgrades.find(u => u.id === 'magnet_tech')?.currentLevel || 1;
          const magnetRadius = 100 + (magnetLevel - 1) * 40;

          if (hasMagnet && distance(birdX + birdRadius, birdY.current + birdRadius, pipe.coin.x, pipe.coin.y) < magnetRadius) {
            const dx = (birdX + birdRadius) - pipe.coin.x;
            const dy = (birdY.current + birdRadius) - pipe.coin.y;
            pipe.coin.x += dx * 0.15;
            pipe.coin.y += dy * 0.15;
          }

          if (distance(birdX + birdRadius, birdY.current + birdRadius, pipe.coin.x, pipe.coin.y) < birdRadius + pipe.coin.radius + 6) {
            pipe.coin.collected = true;
            runStatsRef.current.coinsCollected += pipe.coin.value;
            setCoins(c => c + pipe.coin!.value);
            audioController.playScore(2);
            particleSystem.current.emitBurst(pipe.coin.x, pipe.coin.y, 8, '#fef08a', 1.2);
            particleSystem.current.emitFloatingText('+1 🪙', pipe.coin.x, pipe.coin.y, '#fef08a', 0.9);
          }
        }

        if (pipe.powerUp && !pipe.powerUp.collected) {
          if (distance(birdX + birdRadius, birdY.current + birdRadius, pipe.powerUp.x, pipe.powerUp.y) < birdRadius + pipe.powerUp.radius + 8) {
            pipe.powerUp.collected = true;
            const pType = pipe.powerUp.type;
            runStatsRef.current.powerUpsUsed++;
            audioController.playPowerUpCollect();

            if (pType === 'slowmo') audioController.setLowPass(3500);

            let durBonus = 0;
            if (pType === 'slowmo') {
              const slowLevel = techUpgrades.find(u => u.id === 'slowmo_tech')?.currentLevel || 1;
              durBonus = (slowLevel - 1) * 1.2;
            }

            const maxDur = POWERUP_DURATIONS[pType] + durBonus;
            const existingIdx = activePowerUpsRef.current.findIndex(a => a.type === pType);
            if (existingIdx >= 0) {
              activePowerUpsRef.current[existingIdx].durationLeft = maxDur;
            } else {
              activePowerUpsRef.current.push({ type: pType, durationLeft: maxDur, maxDuration: maxDur });
            }

            particleSystem.current.emitShockwave(pipe.powerUp.x, pipe.powerUp.y, 80, '#38bdf8');
            particleSystem.current.emitFloatingText(`+${pType.toUpperCase()}!`, birdX, birdY.current - 10, '#38bdf8', 1.1);
          }
        }

        const grazeLevel = techUpgrades.find(u => u.id === 'graze_tech')?.currentLevel || 1;
        const effectiveGrazeDistance = NEAR_MISS_DISTANCE + (grazeLevel - 1) * 8;

        if (!pipe.hasPassedGraze && pipe.x < birdX + birdRadius && pipe.x + PIPE_WIDTH > birdX - birdRadius) {
          const distTopLip = Math.abs((birdY.current) - pipe.topHeight);
          const distBottomLip = Math.abs((birdY.current + BIRD_SIZE) - bottomY);

          if (distTopLip <= effectiveGrazeDistance || distBottomLip <= effectiveGrazeDistance) {
            pipe.hasPassedGraze = true;
            runStatsRef.current.nearMisses++;
            audioController.playGraze();
            cameraTrauma.current.addTrauma(0.12);

            if (activeBossRef.current && !activeBossRef.current.defeated) {
              activeBossRef.current.health -= 15;
              if (activeBossRef.current.health <= 0) {
                activeBossRef.current.defeated = true;
                runStatsRef.current.bossDefeated = true;
                particleSystem.current.emitShockwave(activeBossRef.current.x, activeBossRef.current.y, 200, '#e879f9');
                particleSystem.current.emitBurst(activeBossRef.current.x, activeBossRef.current.y, 50, '#fbbf24', 3.0);
                audioController.playShieldBreak();
              }
            }

            comboFramesLeft.current = COMBO_TIMEOUT_FRAMES;
            setCombo(c => {
              const nextCombo = c + 1;
              const nextMult = clamp(1 + Math.floor(nextCombo / 3) + (grazeLevel - 1), 1, 5);
              setMultiplier(nextMult);
              audioController.setComboMultiplier(nextMult);
              runStatsRef.current.maxCombo = Math.max(runStatsRef.current.maxCombo, nextCombo);
              return nextCombo;
            });

            particleSystem.current.emitBurst(birdX + birdRadius, birdY.current + birdRadius, 10, '#38bdf8', 1.4);
            particleSystem.current.emitFloatingText('GRAZE! +2x', birdX + 20, birdY.current, '#38bdf8', 1.0);
          }
        }

        const collidesTop = circleIntersectBox(birdX + birdRadius, birdY.current + birdRadius, birdRadius - 4, pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        const collidesBottom = circleIntersectBox(birdX + birdRadius, birdY.current + birdRadius, birdRadius - 4, pipe.x, bottomY, PIPE_WIDTH, bottomH);

        if (collidesTop || collidesBottom) {
          const shieldIdx = activePowerUpsRef.current.findIndex(p => p.type === 'shield');
          if (isBoost) {
            particleSystem.current.emitShockwave(pipe.x + PIPE_WIDTH / 2, birdY.current, 90, '#f59e0b');
            particleSystem.current.emitBurst(pipe.x + PIPE_WIDTH / 2, birdY.current, 15, '#fbbf24', 1.5);
            pipes.current.splice(i, 1);
            continue;
          } else if (shieldIdx >= 0) {
            activePowerUpsRef.current.splice(shieldIdx, 1);
            audioController.playShieldBreak();
            cameraTrauma.current.addTrauma(0.5);
            particleSystem.current.emitShockwave(birdX, birdY.current, 100, '#38bdf8');
            particleSystem.current.emitBurst(birdX, birdY.current, 20, '#38bdf8', 2.0);
            particleSystem.current.emitFloatingText('SHIELD BROKEN!', birdX, birdY.current - 15, '#f43f5e', 1.2);
            pipe.x -= PIPE_WIDTH + 20;
          } else {
            triggerGameOver();
            return;
          }
        }

        if (!pipe.passed && birdX > pipe.x + PIPE_WIDTH) {
          pipe.passed = true;
          const addedScore = 1 * (comboFramesLeft.current > 0 ? multiplier : 1);
          runStatsRef.current.score += addedScore;
          setScore(runStatsRef.current.score);
          audioController.playScore(combo);
          particleSystem.current.emitFloatingText(`+${addedScore}`, birdX + 25, birdY.current, '#fbbf24', 1.0);
        }

        if (pipe.x + PIPE_WIDTH < -60) {
          pipes.current.splice(i, 1);
        }
      }

      if (comboFramesLeft.current > 0) {
        comboFramesLeft.current--;
        if (comboFramesLeft.current === 0) {
          setCombo(0);
          setMultiplier(1);
          audioController.setComboMultiplier(1);
        }
      }

      // Ceiling soft clamp (no instant death)
      if (birdY.current < 10) {
        birdY.current = 10;
        birdVelocity.current = Math.max(0, birdVelocity.current);
      }

      // Ground collision with launch grace period
      const groundY = height - 48;
      const runElapsed = (performance.now() - runStartTime.current) * 0.001;
      if (birdY.current + BIRD_SIZE >= groundY && runElapsed > 0.8) {
        triggerGameOver();
        return;
      }

      frameCount.current++;
    }

    // --- CAMERA TRAUMA & SHAKE ---
    cameraTrauma.current.update(dt);
    particleSystem.current.update(dt);

    // --- RENDER PASS ---
    ctx.save();
    if (cameraTrauma.current.trauma > 0) {
      ctx.translate(cameraTrauma.current.offsetX, cameraTrauma.current.offsetY);
      ctx.rotate(cameraTrauma.current.angle);
    }

    // 1. Render Parallax Multi-layer Background
    gameRenderer.renderBackground(ctx, width, height, currentBiome, scrollX.current, time);

    // 2. Render Pipes & In-Gate Items
    pipes.current.forEach(p => gameRenderer.renderPipe(ctx, p, height, currentBiome, time));

    // 3. Render Ground
    gameRenderer.renderGround(ctx, width, height, 48, currentBiome, scrollX.current, time);

    // 4. Render Boss Entity if active
    if (activeBossRef.current) {
      gameRenderer.renderBoss(ctx, activeBossRef.current, time);
    }

    // 5. Render Ghost Pilot
    const elapsed = (performance.now() - runStartTime.current) * 0.001;
    const ghostPos = ghostTelemetry.getGhostPosition(elapsed);
    if (ghostPos && gameState === GameState.PLAYING) {
      gameRenderer.renderGhost(ctx, ghostPos.y, ghostPos.v);
    }

    // 6. Render Particle System
    particleSystem.current.render(ctx);

    // 7. Render Character Player
    gameRenderer.renderPlayer(
      ctx,
      65,
      birdY.current,
      birdVelocity.current,
      equippedSkin,
      activePowerUpsRef.current,
      time
    );

    ctx.restore();

    // 8. Cinematic Post-Processing Pass
    gameRenderer.renderPostProcessing(ctx, width, height);

    // ALWAYS keep loop animating across all states
    requestRef.current = requestAnimationFrame(loop);
  }, [gameState, dimensions, currentBiome, equippedSkin, equippedTrail, combo, multiplier, gameMode, triggerGameOver, jump]);

  // Animation Frame Loop Lifecycle
  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [loop]);

  // Input Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      } else if (e.code === 'KeyP' || e.code === 'Escape') {
        if (gameState === GameState.PLAYING) {
          setGameState(GameState.PAUSED);
          audioController.setLowPass(800);
        } else if (gameState === GameState.PAUSED) {
          setGameState(GameState.PLAYING);
          audioController.setLowPass(20000);
        }
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      // If clicking inside a button, modal link, or input, let the button handle it
      if (target && target.closest && (target.closest('button') || target.closest('a') || target.closest('input'))) {
        return;
      }
      e.preventDefault();
      jump();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [jump, gameState]);

  const handleUpdateSound = (newSettings: Partial<SoundSettings>) => {
    const updated = { ...soundSettings, ...newSettings };
    setSoundSettings(updated);
    storageService.saveSoundSettings(updated);
    audioController.setSettings(updated);
  };

  const handleSelectSkin = (skinId: string) => {
    setEquippedSkinId(skinId);
    storageService.setEquippedSkinId(skinId);
  };

  const handleUnlockSkin = (skin: Skin) => {
    if (storageService.spendCoins(skin.cost)) {
      storageService.unlockSkin(skin.id);
      setSkins(storageService.getSkins());
      setCoins(storageService.getCoins());
      setEquippedSkinId(skin.id);
      storageService.setEquippedSkinId(skin.id);
      audioController.playPowerUpCollect();
    }
  };

  const handleSelectTrail = (trailId: string) => {
    setEquippedTrailId(trailId);
    storageService.setEquippedTrailId(trailId);
  };

  const handleUnlockTrail = (trail: TrailTheme) => {
    if (storageService.spendCoins(trail.cost)) {
      storageService.unlockTrailTheme(trail.id);
      setTrailThemes(storageService.getTrailThemes());
      setCoins(storageService.getCoins());
      setEquippedTrailId(trail.id);
      storageService.setEquippedTrailId(trail.id);
      audioController.playPowerUpCollect();
    }
  };

  const handleUpgradeTech = (techId: string) => {
    const tech = techUpgrades.find(u => u.id === techId);
    if (!tech || tech.currentLevel >= tech.maxLevel) return;

    const cost = Math.round(tech.baseCost * Math.pow(tech.costMultiplier, tech.currentLevel - 1));
    if (storageService.spendCoins(cost)) {
      const updated = techUpgrades.map(u => u.id === techId ? { ...u, currentLevel: u.currentLevel + 1 } : u);
      storageService.saveTechUpgrades(updated);
      setTechUpgrades(updated);
      setCoins(storageService.getCoins());
      audioController.playPowerUpCollect();
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-950 select-none touch-none overflow-hidden font-sans">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-10" />

      {/* In-Game Glassmorphism HUD */}
      {gameState === GameState.PLAYING && (
        <HUD
          score={score}
          highScore={highScore}
          coins={coins}
          combo={combo}
          multiplier={multiplier}
          activePowerUps={activePowerUps}
          biome={currentBiome}
          gameMode={gameMode}
          boss={activeBoss}
          onPause={() => {
            setGameState(GameState.PAUSED);
            audioController.setLowPass(800);
          }}
        />
      )}

      {/* Start Screen Overlay */}
      {gameState === GameState.START && (
        <StartScreen
          highScore={highScore}
          coins={coins}
          equippedSkin={equippedSkin}
          isMuted={soundSettings.muted}
          selectedMode={gameMode}
          isGamepadConnected={isGamepadConnected}
          onSelectMode={setGameMode}
          onStart={startGame}
          onOpenShop={() => setIsShopOpen(true)}
          onOpenTechTree={() => setIsTechTreeOpen(true)}
          onOpenBounties={() => setIsBountiesOpen(true)}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
          onToggleMute={() => handleUpdateSound({ muted: !soundSettings.muted })}
        />
      )}

      {/* Game Over Modal */}
      {gameState === GameState.GAME_OVER && (
        <GameOverModal
          stats={runStatsRef.current}
          highScore={highScore}
          aiCommentary={aiCommentary}
          onRestart={startGame}
        />
      )}

      {/* Pause Modal */}
      {gameState === GameState.PAUSED && (
        <PauseModal
          soundSettings={soundSettings}
          onResume={() => {
            setGameState(GameState.PLAYING);
            audioController.setLowPass(20000);
          }}
          onRestart={startGame}
          onHome={() => {
            setGameState(GameState.START);
            audioController.stopMusic();
          }}
          onUpdateSound={handleUpdateSound}
        />
      )}

      {/* Shop Modal */}
      {isShopOpen && (
        <ShopModal
          skins={skins}
          trailThemes={trailThemes}
          equippedSkinId={equippedSkinId}
          equippedTrailId={equippedTrailId}
          totalCoins={coins}
          onSelectSkin={handleSelectSkin}
          onUnlockSkin={handleUnlockSkin}
          onSelectTrail={handleSelectTrail}
          onUnlockTrail={handleUnlockTrail}
          onClose={() => setIsShopOpen(false)}
        />
      )}

      {/* Tech Tree Modal */}
      {isTechTreeOpen && (
        <SkillTreeModal
          techUpgrades={techUpgrades}
          totalCoins={coins}
          onUpgradeTech={handleUpgradeTech}
          onClose={() => setIsTechTreeOpen(false)}
        />
      )}

      {/* Bounties & Bestiary Modal */}
      {isBountiesOpen && (
        <BountiesModal
          bounties={bounties}
          bestiary={bestiary}
          onClose={() => setIsBountiesOpen(false)}
        />
      )}

      {/* Achievements Modal */}
      {isAchievementsOpen && (
        <AchievementsModal
          achievements={achievements}
          onClose={() => setIsAchievementsOpen(false)}
        />
      )}
    </div>
  );
};

export default GameCanvas;