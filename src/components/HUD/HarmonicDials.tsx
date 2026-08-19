/**
 * TOPOLOGICA: Interactive Tri-Harmonic Frequency Modulation Dials
 */

import React from 'react';
import { HarmonicFrequencies, HarmonicRatioLock } from '../../game/types';
import { Math4D } from '../../engine/Math4D';

interface HarmonicDialsProps {
  harmonics: HarmonicFrequencies;
  harmonicLock: HarmonicRatioLock;
  onSetHarmonics: (alpha?: number, beta?: number, gamma?: number) => void;
}

export const HarmonicDials: React.FC<HarmonicDialsProps> = ({
  harmonics,
  harmonicLock,
  onSetHarmonics
}) => {
  const presets = [
    { label: '1:1 Unison', a: 1.5, b: 1.5 },
    { label: '4:3 Fourth', a: 2.0, b: 1.5 },
    { label: '3:2 Fifth', a: 3.0, b: 2.0 },
    { label: 'Φ Golden', a: 3.236, b: 2.0 },
    { label: '2:1 Octave', a: 4.0, b: 2.0 },
    { label: 'e Euler', a: 5.436, b: 2.0 },
  ];

  return (
    <div className="flex flex-col gap-3 bg-slate-900/85 backdrop-blur-lg border border-slate-700/60 rounded-2xl p-4 shadow-2xl shadow-black/80 max-w-sm w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-widest text-slate-200 uppercase">
            Harmonic Tensor Dials
          </span>
        </div>
        <div className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
          Δ = {(Math.max(harmonics.alpha, harmonics.beta) / Math.max(0.001, Math.min(harmonics.alpha, harmonics.beta))).toFixed(3)}
        </div>
      </div>

      {/* Dial 1: Alpha (Spatial Curvature) */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-sky-300 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            α Spatial Curvature (κ)
          </span>
          <span className="text-sky-400 font-bold bg-slate-800/80 px-2 py-0.5 rounded">
            {harmonics.alpha.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSetHarmonics(Math.max(0.5, harmonics.alpha - 0.1))}
            className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 active:bg-sky-600 text-slate-300 rounded font-mono font-bold text-sm transition"
          >
            -
          </button>
          <input
            type="range"
            min="0.5"
            max="6.0"
            step="0.01"
            value={harmonics.alpha}
            onChange={(e) => onSetHarmonics(parseFloat(e.target.value))}
            className="flex-1 accent-sky-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />
          <button
            onClick={() => onSetHarmonics(Math.min(6.0, harmonics.alpha + 0.1))}
            className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 active:bg-sky-600 text-slate-300 rounded font-mono font-bold text-sm transition"
          >
            +
          </button>
        </div>
      </div>

      {/* Dial 2: Beta (Temporal Viscosity) */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-violet-300 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            β Temporal Viscosity (τ)
          </span>
          <span className="text-violet-400 font-bold bg-slate-800/80 px-2 py-0.5 rounded">
            {harmonics.beta.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSetHarmonics(undefined, Math.max(0.5, harmonics.beta - 0.1))}
            className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 active:bg-violet-600 text-slate-300 rounded font-mono font-bold text-sm transition"
          >
            -
          </button>
          <input
            type="range"
            min="0.5"
            max="6.0"
            step="0.01"
            value={harmonics.beta}
            onChange={(e) => onSetHarmonics(undefined, parseFloat(e.target.value))}
            className="flex-1 accent-violet-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />
          <button
            onClick={() => onSetHarmonics(undefined, Math.min(6.0, harmonics.beta + 0.1))}
            className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 active:bg-violet-600 text-slate-300 rounded font-mono font-bold text-sm transition"
          >
            +
          </button>
        </div>
      </div>

      {/* Dial 3: Gamma (4D Hyper-Phase) */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            γ 4D Hyper-Phase (W-Slice)
          </span>
          <span className="text-emerald-400 font-bold bg-slate-800/80 px-2 py-0.5 rounded">
            {((harmonics.gamma * 180) / Math.PI).toFixed(0)}°
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSetHarmonics(undefined, undefined, harmonics.gamma - 0.15)}
            className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 text-slate-300 rounded font-mono font-bold text-sm transition"
          >
            ⟲
          </button>
          <input
            type="range"
            min="0"
            max={Math.PI * 2}
            step="0.02"
            value={harmonics.gamma}
            onChange={(e) => onSetHarmonics(undefined, undefined, parseFloat(e.target.value))}
            className="flex-1 accent-emerald-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />
          <button
            onClick={() => onSetHarmonics(undefined, undefined, harmonics.gamma + 0.15)}
            className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 text-slate-300 rounded font-mono font-bold text-sm transition"
          >
            ⟳
          </button>
        </div>
      </div>

      {/* Snap Preset Buttons */}
      <div className="grid grid-cols-3 gap-1.5 pt-1">
        {presets.map((p) => {
          const isActive = Math.abs(harmonics.alpha / harmonics.beta - p.a / p.b) < 0.05;
          return (
            <button
              key={p.label}
              onClick={() => onSetHarmonics(p.a, p.b)}
              className={`py-1 px-1.5 rounded text-[10px] font-mono font-semibold transition border ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm shadow-amber-500/30'
                  : 'bg-slate-800/60 hover:bg-slate-700 text-slate-400 border-slate-700/40'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
