/**
 * TOPOLOGICA: Entropy Collapse / Game Over Modal
 */

import React from 'react';
import { SectorConfig } from '../../game/types';

interface GameOverModalProps {
  isOpen: boolean;
  sector: SectorConfig;
  score: number;
  chromaFluxEarned: number;
  onRetry: () => void;
  onOpenAtlas: () => void;
  onOpenUpgrades: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  sector,
  score,
  chromaFluxEarned,
  onRetry,
  onOpenAtlas,
  onOpenUpgrades
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-slate-950 border border-rose-500/50 rounded-3xl p-6 max-w-md w-full flex flex-col shadow-2xl shadow-rose-950/80 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg shadow-rose-600/30">
          ⚠️
        </div>

        <h2 className="text-xl font-mono font-black text-white tracking-widest uppercase">
          Entropy Fracture
        </h2>
        <p className="text-xs font-mono text-rose-300 mb-5">
          The non-Euclidean manifold collapsed under extreme turbulent entropy.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 flex flex-col">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Resonance Achieved</span>
            <span className="text-xl font-mono font-black text-white">{score}</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 flex flex-col">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Chroma-Flux Saved</span>
            <span className="text-xl font-mono font-black text-violet-300">+{chromaFluxEarned} 💎</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onRetry}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-mono font-black text-sm tracking-wider uppercase shadow-xl transition"
          >
            Re-Calibrate Manifold ↺
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onOpenUpgrades}
              className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-violet-300 font-mono text-xs font-bold transition border border-violet-800/40"
            >
              ⚡ Upgrades
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
