/**
 * TOPOLOGICA: Topological Bestiary & Anomaly Codex Modal
 */

import React, { useState } from 'react';
import { BestiaryEntry } from '../../game/types';

interface BestiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  bestiary: BestiaryEntry[];
}

export const BestiaryModal: React.FC<BestiaryModalProps> = ({
  isOpen,
  onClose,
  bestiary
}) => {
  const [selectedSpecies, setSelectedSpecies] = useState<string>(bestiary[0]?.species || 'gyroid_hydra');

  if (!isOpen) return null;

  const current = bestiary.find(b => b.species === selectedSpecies) || bestiary[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-slate-950 border border-emerald-500/40 rounded-3xl p-6 max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl shadow-emerald-950/80">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📖</span>
            <div>
              <h2 className="text-lg font-mono font-black text-white tracking-wider uppercase">
                Topological Anomaly Codex
              </h2>
              <p className="text-xs font-mono text-emerald-400">
                Taxonomy and dimensional analysis of 4D non-Euclidean singularities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-mono font-bold transition border border-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Content: Sidebar + Detail View */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto flex-1 pr-1">
          {/* Sidebar List */}
          <div className="flex flex-col gap-2">
            {bestiary.map((b) => {
              const isSelected = b.species === selectedSpecies;
              const isEncountered = b.encounteredCount > 0;

              return (
                <button
                  key={b.species}
                  onClick={() => setSelectedSpecies(b.species)}
                  className={`text-left p-3 rounded-2xl transition border ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-400 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold">
                      {isEncountered ? b.name : 'Unknown Anomaly ???'}
                    </span>
                    {isEncountered && (
                      <span className="text-[10px] font-mono text-emerald-400">
                        {b.stabilizedCount}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                    {isEncountered ? b.topologicalClassification : 'Dimensional Encrypted'}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Main Anomaly Detail View */}
          <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            {current ? (
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-mono font-black text-white">
                      {current.name}
                    </h3>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
                      {current.topologicalClassification}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-cyan-300">
                    Signature: {current.dimensionalSignature}
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Cosmic Lore & Topology
                  </div>
                  <p className="text-xs font-sans text-slate-300 leading-relaxed">
                    {current.lore}
                  </p>
                </div>

                <div className="bg-amber-950/20 border border-amber-500/30 p-3.5 rounded-xl">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 mb-1 font-bold">
                    ⚡ Harmonic Resonance Weakness
                  </div>
                  <div className="text-xs font-mono text-amber-200">
                    {current.harmonicWeakness}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Encountered</div>
                    <div className="text-base font-mono font-black text-cyan-300">{current.encounteredCount}</div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Stabilized</div>
                    <div className="text-base font-mono font-black text-emerald-300">{current.stabilizedCount}</div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
