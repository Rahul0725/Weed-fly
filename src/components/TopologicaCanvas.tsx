/**
 * TOPOLOGICA: Master Canvas & Game Coordinator Component
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TopologicaGame } from '../game/TopologicaGame';
import { RaymarchRenderer } from '../engine/RaymarchRenderer';
import { Math4D } from '../engine/Math4D';
import { GameState, SectorConfig, SoundSettings, SandboxParameters } from '../game/types';
import { SECTORS } from '../game/SectorsData';

import { TopologicalHUD } from './HUD/TopologicalHUD';
import { SectorSelectModal } from './Modals/SectorSelectModal';
import { HarmonicMatrixModal } from './Modals/HarmonicMatrixModal';
import { BestiaryModal } from './Modals/BestiaryModal';
import { CosmicOracleModal } from './Modals/CosmicOracleModal';
import { SandboxLabModal } from './Modals/SandboxLabModal';
import { SectorClearModal } from './Modals/SectorClearModal';
import { GameOverModal } from './Modals/GameOverModal';
import { PauseModal } from './Modals/PauseModal';
import { HowToPlayModal } from './Modals/HowToPlayModal';
import { harmonicAudioEngine } from '../audio/HarmonicAudioEngine';
import { storageService } from '../services/storageService';

export const TopologicaCanvas: React.FC = () => {
  const webglCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  const gameRef = useRef<TopologicaGame>(new TopologicaGame());
  const rendererRef = useRef<RaymarchRenderer | null>(null);

  // Synchronized React state for HUD
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [sector, setSector] = useState<SectorConfig>(SECTORS[0]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [entropy, setEntropy] = useState(0);
  const [chromaFlux, setChromaFlux] = useState(150);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [chromaFluxEarned, setChromaFluxEarned] = useState(0);
  const [totalStabilizations, setTotalStabilizations] = useState(0);
  const [harmonics, setHarmonics] = useState({ alpha: 1.5, beta: 1.5, gamma: 0.0 });
  const [harmonicLock, setHarmonicLock] = useState(gameRef.current.harmonicLock);
  const [singularities, setSingularities] = useState(gameRef.current.singularities);
  const [conduits, setConduits] = useState(gameRef.current.conduits);

  // Modal Open States
  const [isSectorsOpen, setIsSectorsOpen] = useState(false);
  const [isUpgradesOpen, setIsUpgradesOpen] = useState(false);
  const [isBestiaryOpen, setIsBestiaryOpen] = useState(false);
  const [isOracleOpen, setIsOracleOpen] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isPauseOpen, setIsPauseOpen] = useState(false);

  // Settings & Sandbox
  const [soundSettings, setSoundSettings] = useState<SoundSettings>(storageService.getSoundSettings());
  const [sandboxParams, setSandboxParams] = useState<SandboxParameters>(storageService.getSandboxParams());

  // Initialize WebGL2 Engine and Game
  useEffect(() => {
    const webglCanvas = webglCanvasRef.current;
    if (!webglCanvas) return;

    const renderer = new RaymarchRenderer(webglCanvas);
    if (renderer.initialize()) {
      rendererRef.current = renderer;
    }

    const game = gameRef.current;
    setHighScore(game.playerStats.highScore);
    setChromaFlux(game.playerStats.chromaFlux);

    let animId: number;

    const loop = (time: number) => {
      const overlayCanvas = overlayCanvasRef.current;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // 1. Update Game Physics
      game.update(time, width, height);

      // 2. Sync React State for HUD & Modals periodically
      setGameState(game.gameState);
      setScore(game.score);
      setEntropy(game.entropy);
      setChromaFlux(game.playerStats.chromaFlux);
      setCombo(game.combo);
      setMaxCombo(game.maxCombo);
      setChromaFluxEarned(game.chromaFluxEarned);
      setTotalStabilizations(game.totalStabilizations);
      setHarmonics({ ...game.harmonics });
      setHarmonicLock({ ...game.harmonicLock });
      setSingularities([...game.singularities]);
      setConduits([...game.conduits]);
      setSector(game.currentSector);

      // 3. Render 4D WebGL2 Raymarcher
      if (rendererRef.current) {
        const manifold = game.gameState === GameState.SANDBOX
          ? game.sandboxParams.manifoldType
          : game.currentSector.initialManifold.manifoldType;

        const surfaceDist = game.gameState === GameState.SANDBOX
          ? game.sandboxParams.surfaceDistortion
          : game.currentSector.initialManifold.surfaceDistortion;

        const gravWarp = game.gameState === GameState.SANDBOX
          ? game.sandboxParams.gravitationalWarp
          : game.currentSector.initialManifold.gravitationalWarp;

        const ambCol = game.gameState === GameState.SANDBOX
          ? [0.2, 0.15, 0.4] as [number, number, number]
          : game.currentSector.initialManifold.ambientColor;

        const glowCol = game.gameState === GameState.SANDBOX
          ? [0.6, 0.8, 1.0] as [number, number, number]
          : game.currentSector.initialManifold.glowColor;

        rendererRef.current.render(
          time * 0.001,
          game.harmonics,
          game.harmonicLock,
          game.singularities,
          manifold,
          surfaceDist,
          gravWarp,
          ambCol,
          glowCol,
          game.cameraPos,
          game.cameraTarget,
          game.mousePos,
          game.lensActive,
          game.getLensRadius()
        );
      }

      // 4. Render 2D Overlay (Tether lines, Conduits, Crystals, Reticles)
      if (overlayCanvas) {
        const ctx = overlayCanvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, width, height);

          // Render Particle System
          game.particleSystem.render(ctx, width, height, game.harmonics.gamma);

          // Render Active Conduits
          for (const c of game.conduits) {
            const s1 = game.singularities.find(s => s.id === c.sourceId);
            const s2 = game.singularities.find(s => s.id === c.targetId);
            if (!s1 || !s2) continue;

            const p1 = Math4D.project4DtoScreen({ x: s1.x, y: s1.y, z: s1.z, w: s1.w }, game.harmonics.gamma, width, height);
            const p2 = Math4D.project4DtoScreen({ x: s2.x, y: s2.y, z: s2.z, w: s2.w }, game.harmonics.gamma, width, height);

            if (!p1.visible || !p2.visible) continue;

            const r = Math.round(c.color[0] * 255);
            const g = Math.round(c.color[1] * 255);
            const b = Math.round(c.color[2] * 255);
            const alpha = Math.min(1.0, (p1.wShadow + p2.wShadow) * 0.5);

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * (0.6 + c.resonanceHarmony * 0.4)})`;
            ctx.lineWidth = Math.max(1.5, 3.5 * (p1.scale + p2.scale) * 0.5);
            ctx.shadowColor = `rgb(${r}, ${g}, ${b})`;
            ctx.shadowBlur = 8 + c.resonanceHarmony * 12;
            ctx.stroke();
            ctx.restore();
          }

          // Render Dragging Conduit Line
          if (game.dragSourceId !== null && game.dragCurrentPos) {
            const source = game.singularities.find(s => s.id === game.dragSourceId);
            if (source) {
              const p = Math4D.project4DtoScreen({ x: source.x, y: source.y, z: source.z, w: source.w }, game.harmonics.gamma, width, height);
              if (p.visible) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(game.dragCurrentPos.x, game.dragCurrentPos.y);
                ctx.strokeStyle = 'rgba(250, 204, 21, 0.85)';
                ctx.lineWidth = 2.5;
                ctx.setLineDash([6, 6]);
                ctx.shadowColor = '#facc15';
                ctx.shadowBlur = 10;
                ctx.stroke();
                ctx.restore();
              }
            }
          }

          // Render Singularity Reticles & Stability Rings
          for (const s of game.singularities) {
            const proj = Math4D.project4DtoScreen({ x: s.x, y: s.y, z: s.z, w: s.w }, game.harmonics.gamma, width, height);
            if (!proj.visible) continue;

            const radius = Math.max(12, 38 * proj.scale);
            const r = Math.round(s.color[0] * 255);
            const g = Math.round(s.color[1] * 255);
            const b = Math.round(s.color[2] * 255);
            const alpha = proj.wShadow;

            ctx.save();

            // Outer Pulsing Glow
            const pulse = Math.sin(s.pulsePhase) * 4;
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, radius + pulse, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.7})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Stability Progress Arc
            if (s.stability > 0.05) {
              ctx.beginPath();
              ctx.arc(proj.x, proj.y, radius + 8, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * s.stability);
              ctx.strokeStyle = '#facc15';
              ctx.lineWidth = 3;
              ctx.shadowColor = '#facc15';
              ctx.shadowBlur = 10;
              ctx.stroke();
            }

            ctx.restore();
          }

          // Render Gravitational Lens Reticle if Active
          if (game.lensActive) {
            ctx.save();
            ctx.beginPath();
            const lensPixRadius = game.getLensRadius() * 400;
            ctx.arc(game.mousePos[0], game.mousePos[1], lensPixRadius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    // Resize Handler
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (rendererRef.current) {
        rendererRef.current.resize(w, h);
      }
      if (overlayCanvasRef.current) {
        overlayCanvasRef.current.width = w;
        overlayCanvasRef.current.height = h;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Set Harmonics Handler
  const handleSetHarmonics = useCallback((alpha?: number, beta?: number, gamma?: number) => {
    gameRef.current.setHarmonics(alpha, beta, gamma);
  }, []);

  // Wheel Event Handler for 4D Hyper-Phase Rotation
  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY * 0.003;
    gameRef.current.setHarmonics(undefined, undefined, gameRef.current.harmonics.gamma + delta);
  };

  // Pointer Event Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gameRef.current.handlePointerDown(x, y, window.innerWidth, window.innerHeight, e.button === 2);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gameRef.current.handlePointerMove(x, y);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gameRef.current.handlePointerUp(x, y, window.innerWidth, window.innerHeight);
  };

  // Upgrade Purchase
  const handlePurchaseUpgrade = (upgradeId: string): boolean => {
    return gameRef.current.purchaseUpgrade(upgradeId);
  };

  // Sound Settings Update
  const handleUpdateSoundSettings = (settings: SoundSettings) => {
    setSoundSettings(settings);
    harmonicAudioEngine.updateSettings(settings);
    storageService.saveSoundSettings(settings);
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-black select-none touch-none"
      onWheel={handleWheel}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 1. WebGL2 4D Raymarching Canvas */}
      <canvas
        ref={webglCanvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* 2. 2D Conduit & Particle Overlay Canvas */}
      <canvas
        ref={overlayCanvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute inset-0 w-full h-full cursor-crosshair"
      />

      {/* 3. Start Screen / Main Menu */}
      {gameState === GameState.START && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-slate-950/90 border border-cyan-500/40 rounded-3xl p-8 max-w-xl w-full flex flex-col items-center text-center shadow-2xl shadow-cyan-950/90">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-violet-500 flex items-center justify-center text-4xl mb-4 shadow-xl shadow-cyan-500/30 animate-pulse">
              🌌
            </div>

            <h1 className="text-2xl md:text-3xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-300 to-violet-400 tracking-widest uppercase mb-1">
              TOPOLOGICA
            </h1>
            <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-6">
              4D Resonance Architect
            </p>

            <p className="text-xs font-sans text-slate-300 leading-relaxed max-w-md mb-8">
              Step beyond Euclidean space into an active 4-dimensional continuous manifold. Weave phase-tether conduits across harmonic singularities, calibrate spacetime curvature tensor frequencies, and collapse chaotic entropy fractures into radiant photonic crystals.
            </p>

            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button
                onClick={() => gameRef.current.startSector(1)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-black text-sm tracking-wider uppercase shadow-xl transition"
              >
                Initiate Resonance ➔
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsHowToPlayOpen(true)}
                  className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-mono text-xs font-bold transition border border-cyan-800/40"
                >
                  ❓ How to Play
                </button>
                <button
                  onClick={() => gameRef.current.startSandbox()}
                  className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 font-mono text-xs font-bold transition border border-emerald-800/40"
                >
                  🧪 4D Sandbox Lab
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Active HUD Overlay */}
      {(gameState === GameState.PLAYING || gameState === GameState.SANDBOX) && (
        <TopologicalHUD
          sector={sector}
          score={score}
          highScore={highScore}
          targetStability={sector.targetStability}
          entropy={entropy}
          chromaFlux={chromaFlux}
          combo={combo}
          harmonics={harmonics}
          harmonicLock={harmonicLock}
          singularities={singularities}
          conduits={conduits}
          onSetHarmonics={handleSetHarmonics}
          onOpenSectors={() => setIsSectorsOpen(true)}
          onOpenUpgrades={() => setIsUpgradesOpen(true)}
          onOpenBestiary={() => setIsBestiaryOpen(true)}
          onOpenOracle={() => setIsOracleOpen(true)}
          onOpenSandbox={() => setIsSandboxOpen(true)}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          onPause={() => setIsPauseOpen(true)}
        />
      )}

      {/* 5. Modals */}
      <SectorSelectModal
        isOpen={isSectorsOpen}
        onClose={() => setIsSectorsOpen(false)}
        unlockedSectors={gameRef.current.playerStats.sectorsCompleted}
        onSelectSector={(id) => gameRef.current.startSector(id)}
        currentSectorId={sector.id}
      />

      <HarmonicMatrixModal
        isOpen={isUpgradesOpen}
        onClose={() => setIsUpgradesOpen(false)}
        upgrades={gameRef.current.upgrades}
        chromaFlux={chromaFlux}
        onPurchase={handlePurchaseUpgrade}
      />

      <BestiaryModal
        isOpen={isBestiaryOpen}
        onClose={() => setIsBestiaryOpen(false)}
        bestiary={gameRef.current.bestiary}
      />

      <CosmicOracleModal
        isOpen={isOracleOpen}
        onClose={() => setIsOracleOpen(false)}
        sector={sector}
        score={score}
        harmonicLock={harmonicLock}
        totalStabilizations={totalStabilizations}
        entropy={entropy}
      />

      <SandboxLabModal
        isOpen={isSandboxOpen}
        onClose={() => setIsSandboxOpen(false)}
        params={sandboxParams}
        onChangeParams={(p) => {
          setSandboxParams(p);
          gameRef.current.sandboxParams = p;
          storageService.saveSandboxParams(p);
        }}
        onEnterSandboxMode={() => gameRef.current.startSandbox()}
      />

      <SectorClearModal
        isOpen={gameState === GameState.SECTOR_CLEAR}
        sector={sector}
        score={score}
        chromaFluxEarned={chromaFluxEarned}
        maxCombo={maxCombo}
        totalStabilizations={totalStabilizations}
        onNextSector={() => gameRef.current.startSector(sector.id + 1)}
        onReplaySector={() => gameRef.current.startSector(sector.id)}
        onOpenAtlas={() => setIsSectorsOpen(true)}
      />

      <GameOverModal
        isOpen={gameState === GameState.GAME_OVER}
        sector={sector}
        score={score}
        chromaFluxEarned={chromaFluxEarned}
        onRetry={() => gameRef.current.startSector(sector.id)}
        onOpenAtlas={() => setIsSectorsOpen(true)}
        onOpenUpgrades={() => setIsUpgradesOpen(true)}
      />

      <PauseModal
        isOpen={isPauseOpen}
        onResume={() => setIsPauseOpen(false)}
        onRestart={() => {
          setIsPauseOpen(false);
          gameRef.current.startSector(sector.id);
        }}
        onOpenAtlas={() => {
          setIsPauseOpen(false);
          setIsSectorsOpen(true);
        }}
        soundSettings={soundSettings}
        onUpdateSoundSettings={handleUpdateSoundSettings}
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />
    </div>
  );
};
