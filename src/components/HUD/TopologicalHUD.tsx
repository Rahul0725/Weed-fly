/**
 * TOPOLOGICA: High-Tech Glassmorphism HUD Overlay
 */

import React from 'react';
import {
  HarmonicFrequencies,
  HarmonicRatioLock,
  SectorConfig,
  SingularityEntity,
  ConduitLink
} from '../../game/types';
import { LissajousPlot } from './LissajousPlot';
import { HarmonicDials } from './HarmonicDials';
import { TopologicalCompass } from './TopologicalCompass';

interface TopologicalHUDProps {
  sector: SectorConfig;
  score: number;
  highScore: number;
  targetStability: number;
  entropy: number;
  chromaFlux: number;
  combo: number;
  harmonics: HarmonicFrequencies;
  harmonicLock: HarmonicRatioLock;
  singularities: SingularityEntity[];
  conduits: ConduitLink[];
  onSetHarmonics: (alpha?: number, beta?: number, gamma?: number) => void;
  onOpenSectors: () => void;
  onOpenUpgrades: () => void;
  onOpenBestiary: () => void;
  onOpenOracle: () => void;
  onOpenSandbox: () => void;
  onOpenHowToPlay: () => void;
  onPause: () => void;
}

export const TopologicalHUD: React.FC<TopologicalHUDProps> = ({
  sector,
  score,
  highScore,
  targetStability,
  entropy,
  chromaFlux,
  combo,
  harmonics,
  harmonicLock,
  singularities,
  conduits,
  onSetHarmonics,
  onOpenSectors,
  onOpenUpgrades,
  onOpenBestiary,
  onOpenOracle,
  onOpenSandbox,
  onOpenHowToPlay,
  onPause
}) => {
  const scorePercent = Math.min(100, (score / Math.max(1, targetStability)) * 100);
  const entropyCritical = entropy > 75;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-20 select-none">
      {/* --- TOP HEADER BAR --- */}
      <div className="flex items-start justify-between gap-4 w-full">
        {/* Left: Sector & Stability Progress */}
        <div className="flex flex-col gap-1.5 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-3.5 shadow-xl max-w-sm pointer-events-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
              {sector.name}
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
              Difficulty: {sector.difficulty}/8
            </span>
          </div>

          {/* Target Stability Progress Bar */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">Manifold Stability:</span>
              <span className="text-emerald-400 font-bold">
                {score} / {targetStability} ({scorePercent.toFixed(0)}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-300 transition-all duration-300"
                style={{ width: `${scorePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Harmonic Resonance Status Banner */}
        <div className="flex flex-col items-center pointer-events-auto">
          <div
            className={`flex items-center gap-3 px-4 py-2 rounded-2xl backdrop-blur-lg border transition-all duration-300 shadow-xl ${
              harmonicLock.precision > 0.2
                ? 'bg-slate-900/90 border-amber-400/60 shadow-amber-500/20'
                : 'bg-slate-950/80 border-slate-800'
            }`}
          >
            <div
              className="w-3 h-3 rounded-full animate-ping"
              style={{
                backgroundColor: `rgb(${Math.round(harmonicLock.color[0] * 255)}, ${Math.round(
                  harmonicLock.color[1] * 255
                )}, ${Math.round(harmonicLock.color[2] * 255)})`
              }}
            />
            <div className="flex flex-col">
              <span className="text-xs font-mono font-bold text-slate-200">
                {harmonicLock.name}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Resonance Lock: {(harmonicLock.precision * 100).toFixed(1)}% • Mult: {harmonicLock.multiplier.toFixed(2)}x
              </span>
            </div>

            {combo > 1 && (
              <div className="ml-2 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 text-xs font-black font-mono shadow-md animate-bounce">
                {combo}x COMBO
              </div>
            )}
          </div>
        </div>

        {/* Right: Currency, Entropy & Navigation Buttons */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Chroma Flux Balance */}
          <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 rounded-xl px-3 py-2 shadow-lg">
            <span className="text-lg">💎</span>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest leading-none">Chroma-Flux</span>
              <span className="text-sm font-mono font-black text-white leading-tight">{chromaFlux}</span>
            </div>
          </div>

          {/* Quick Menu Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl p-1.5 shadow-lg">
            <button
              onClick={onOpenOracle}
              title="Cosmic Oracle (Gemini AI)"
              className="w-8 h-8 rounded-lg bg-indigo-950/80 hover:bg-indigo-800 text-indigo-300 flex items-center justify-center transition border border-indigo-700/50"
            >
              🔮
            </button>
            <button
              onClick={onOpenSectors}
              title="Sectors & Atlas"
              className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 flex items-center justify-center transition border border-slate-700/50"
            >
              🌌
            </button>
            <button
              onClick={onOpenUpgrades}
              title="Harmonic Matrix"
              className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 flex items-center justify-center transition border border-slate-700/50"
            >
              ⚡
            </button>
            <button
              onClick={onOpenBestiary}
              title="Topological Bestiary"
              className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 flex items-center justify-center transition border border-slate-700/50"
            >
              📖
            </button>
            <button
              onClick={onOpenSandbox}
              title="4D Sandbox Lab"
              className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 flex items-center justify-center transition border border-slate-700/50"
            >
              🧪
            </button>
            <button
              onClick={onOpenHowToPlay}
              title="How To Play Guide"
              className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 flex items-center justify-center transition border border-slate-700/50"
            >
              ❓
            </button>
            <button
              onClick={onPause}
              title="Pause Game"
              className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 flex items-center justify-center transition border border-slate-700/50"
            >
              ⏸️
            </button>
          </div>
        </div>
      </div>

      {/* --- MIDDLE SIDE PANELS --- */}
      <div className="flex items-center justify-between w-full pointer-events-none">
        {/* Left Instruments: Oscilloscope & 4D Radar */}
        <div className="flex flex-col gap-3 pointer-events-auto">
          <LissajousPlot harmonics={harmonics} harmonicLock={harmonicLock} size={110} />
          <TopologicalCompass
            singularities={singularities}
            conduits={conduits}
            gamma={harmonics.gamma}
            size={110}
          />
        </div>

        {/* Right Gauge: Global Entropy Fracture Meter */}
        <div className="flex flex-col items-center bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-2xl p-3 shadow-xl pointer-events-auto gap-2">
          <span className="text-[10px] font-mono tracking-wider uppercase text-rose-400 font-bold">
            Entropy
          </span>
          <div className="relative w-4 h-36 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`absolute bottom-0 w-full rounded-full transition-all duration-200 ${
                entropyCritical
                  ? 'bg-gradient-to-t from-rose-600 via-rose-500 to-amber-400 animate-pulse'
                  : 'bg-gradient-to-t from-cyan-500 via-violet-500 to-rose-500'
              }`}
              style={{ height: `${entropy}%` }}
            />
          </div>
          <span className={`text-[11px] font-mono font-bold ${entropyCritical ? 'text-rose-400 animate-pulse' : 'text-slate-300'}`}>
            {entropy.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* --- BOTTOM CONTROL DOCK --- */}
      <div className="flex items-end justify-between gap-4 w-full">
        {/* Left Helper Guide */}
        <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800/80 rounded-xl px-3 py-2 max-w-xs text-[11px] font-mono text-slate-300 pointer-events-auto">
          <div className="text-cyan-400 font-bold mb-0.5">🎮 Controls:</div>
          <div>• <span className="text-white font-semibold">Drag</span> between anomalies to weave Conduits</div>
          <div>• <span className="text-white font-semibold">Hold</span> to focus Gravitational Lens</div>
          <div>• <span className="text-white font-semibold">Tune Dials</span> to lock harmonic ratios</div>
        </div>

        {/* Center: Tri-Harmonic Frequency Dials */}
        <div className="pointer-events-auto">
          <HarmonicDials
            harmonics={harmonics}
            harmonicLock={harmonicLock}
            onSetHarmonics={onSetHarmonics}
          />
        </div>

        {/* Right Stats Summary */}
        <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800/80 rounded-xl p-3 flex flex-col gap-1 min-w-[130px] pointer-events-auto">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">High Score</div>
          <div className="text-sm font-mono font-black text-amber-300">{highScore}</div>
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mt-1">Active Conduits</div>
          <div className="text-xs font-mono font-bold text-cyan-300">{conduits.length} / 6</div>
        </div>
      </div>
    </div>
  );
};
