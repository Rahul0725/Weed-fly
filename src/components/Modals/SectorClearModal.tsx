/**
 * TOPOLOGICA: Sector Stabilized & Victory Modal
 */

import React from 'react';
import { SectorConfig } from '../../game/types';

interface SectorClearModalProps {
  isOpen: boolean;
  sector: SectorConfig;
  score: number;
  chromaFluxEarned: number;
  maxCombo: number;
  totalStabilizations: number;
  onNextSector: () => void;
  onReplaySector: () => void;
  onOpenAtlas: () => void;
}

export const SectorClearModal: React.FC<SectorClearModalProps> = ({
  isOpen,
  sector,
  score,
  chromaFluxEarned,
  maxCombo,
  totalStabilizations,
  onNextSector,
  onReplaySector,
  onOpenAtlas
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-slate-950 border border-amber-500/50 rounded-3xl p-6 max-w-lg w-full flex flex-col shadow-2xl shadow-amber-950/80 text-center">
        {/* Glorious Header */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg shadow-amber-500/30 animate-bounce">
          ⭐
        </div>

        <h2 className="text-xl font-mono font-black text-white tracking-widest uppercase">
          Manifold Synchronized!
        </h2>
        <p className="text-xs font-mono text-amber-300 mb-5">
          {sector.name} — Dimensional Resonance Stabilized
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 flex flex-col">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Final Resonance Score</span>
            <span className="text-xl font-mono font-black text-amber-300">{score}</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 flex flex-col">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Chroma-Flux Harvested</span>
            <span className="text-xl font-mono font-black text-violet-300">+{chromaFluxEarned} 💎</span>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex flex-col">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Peak Combo</span>
            <span className="text-lg font-mono font-black text-cyan-300">{maxCombo}x</span>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex flex-col">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Anomalies Crystallized</span>
            <span className="text-lg font-mono font-black text-emerald-300">{totalStabilizations}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onNextSector}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-mono font-black text-sm tracking-wider uppercase shadow-xl transition"
          >
            Advance to Next Sector ➔
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onReplaySector}
              className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs font-bold transition border border-slate-800"
            >
              Replay Sector
            </button>
            <button
              onClick={onOpenAtlas}
              className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs font-bold transition border border-slate-800"
            >
              Sector Atlas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
