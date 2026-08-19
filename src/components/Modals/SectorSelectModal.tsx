/**
 * TOPOLOGICA: Sector Selection & Multiverse Atlas Modal
 */

import React from 'react';
import { SECTORS } from '../../game/SectorsData';
import { SectorConfig } from '../../game/types';

interface SectorSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedSectors: number[];
  onSelectSector: (sectorId: number) => void;
  currentSectorId: number;
}

export const SectorSelectModal: React.FC<SectorSelectModalProps> = ({
  isOpen,
  onClose,
  unlockedSectors,
  onSelectSector,
  currentSectorId
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-slate-950 border border-cyan-500/40 rounded-3xl p-6 max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl shadow-cyan-950/80">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌌</span>
            <div>
              <h2 className="text-lg font-mono font-black text-white tracking-wider uppercase">
                Multiverse Sector Atlas
              </h2>
              <p className="text-xs font-mono text-cyan-400">
                Select a 4D non-Euclidean manifold region to stabilize
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

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto pr-1">
          {SECTORS.map((sector) => {
            const isUnlocked = unlockedSectors.includes(sector.id) || sector.unlockedByDefault;
            const isSelected = sector.id === currentSectorId;

            return (
              <div
                key={sector.id}
                className={`relative rounded-2xl p-4 flex flex-col justify-between transition-all border ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : isUnlocked
                    ? 'bg-slate-900/70 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/50 border-slate-900 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-xs font-mono font-bold text-cyan-300">
                        {sector.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {sector.subtitle}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/50">
                      Diff {sector.difficulty}/8
                    </span>
                  </div>

                  <p className="text-[11px] font-sans text-slate-300 line-clamp-3 mb-3 leading-relaxed">
                    {sector.lore}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 mt-auto">
                  <div className="text-[10px] font-mono text-emerald-400">
                    Goal: {sector.targetStability} pts
                  </div>

                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        onSelectSector(sector.id);
                        onClose();
                      }}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs shadow-md transition"
                    >
                      {isSelected ? 'Resume' : 'Initiate'}
                    </button>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                      🔒 Locked (Clear Sector {sector.id - 1})
                    </span>
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
