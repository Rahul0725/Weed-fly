/**
 * TOPOLOGICA: Harmonic Spectra Upgrade Matrix Modal
 */

import React, { useState } from 'react';
import { UpgradeNode } from '../../game/types';

interface HarmonicMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  upgrades: UpgradeNode[];
  chromaFlux: number;
  onPurchase: (upgradeId: string) => boolean;
}

export const HarmonicMatrixModal: React.FC<HarmonicMatrixModalProps> = ({
  isOpen,
  onClose,
  upgrades,
  chromaFlux,
  onPurchase
}) => {
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'HARMONICS' | 'TETHER' | 'GRAVITY' | 'CHRONOS'>('ALL');

  if (!isOpen) return null;

  const categories = ['ALL', 'HARMONICS', 'TETHER', 'GRAVITY', 'CHRONOS'] as const;
  const filtered = activeCategory === 'ALL' ? upgrades : upgrades.filter(u => u.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-slate-950 border border-violet-500/40 rounded-3xl p-6 max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl shadow-violet-950/80">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h2 className="text-lg font-mono font-black text-white tracking-wider uppercase">
                Harmonic Spectra Upgrade Matrix
              </h2>
              <p className="text-xs font-mono text-violet-400">
                Enhance your 4D manifold manipulation and resonance capabilities
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-900 border border-violet-500/40 rounded-xl px-3 py-1.5 shadow-md">
              <span>💎</span>
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-violet-400 uppercase tracking-widest leading-none">Chroma-Flux</span>
                <span className="text-sm font-mono font-black text-white leading-tight">{chromaFlux}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-mono font-bold transition border border-slate-800"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition border ${
                activeCategory === cat
                  ? 'bg-violet-600 text-white border-violet-400 shadow-md shadow-violet-600/30'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Upgrades Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto pr-1">
          {filtered.map((u) => {
            const isMax = u.level >= u.maxLevel;
            const cost = Math.round(u.costBase * Math.pow(u.costMultiplier, u.level));
            const canAfford = chromaFlux >= cost && !isMax && u.unlocked;

            return (
              <div
                key={u.id}
                className={`rounded-2xl p-4 flex flex-col justify-between border transition ${
                  !u.unlocked
                    ? 'bg-slate-950/40 border-slate-900 opacity-50'
                    : isMax
                    ? 'bg-slate-900/50 border-emerald-500/40'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                        {u.name}
                        {isMax && <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">MAX</span>}
                      </div>
                      <span className="text-[10px] font-mono text-violet-400 bg-slate-950 px-2 py-0.5 rounded mt-1 inline-block">
                        {u.category} • Level {u.level}/{u.maxLevel}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] font-sans text-slate-300 mb-2 leading-relaxed">
                    {u.description}
                  </p>

                  <div className="text-[11px] font-mono text-cyan-300 bg-slate-950/80 p-2 rounded-xl border border-slate-800 mb-3">
                    {u.statDescription(u.level)}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 mt-auto">
                  <div className="text-xs font-mono">
                    {!isMax && u.unlocked ? (
                      <span className="text-slate-300 flex items-center gap-1">
                        Cost: <span className="text-violet-300 font-bold">{cost} 💎</span>
                      </span>
                    ) : isMax ? (
                      <span className="text-emerald-400 font-bold">Completed</span>
                    ) : (
                      <span className="text-slate-500">Locked Dependency</span>
                    )}
                  </div>

                  {!isMax && u.unlocked && (
                    <button
                      onClick={() => onPurchase(u.id)}
                      disabled={!canAfford}
                      className={`px-4 py-1.5 rounded-xl font-mono font-bold text-xs shadow-md transition ${
                        canAfford
                          ? 'bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 text-white cursor-pointer'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                      }`}
                    >
                      Upgrade
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
