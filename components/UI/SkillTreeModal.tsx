import React from 'react';
import { X, Cpu, Coins, ArrowUpCircle } from 'lucide-react';
import { TechUpgrade } from '../../types';

interface SkillTreeModalProps {
  techUpgrades: TechUpgrade[];
  totalCoins: number;
  onUpgradeTech: (techId: string) => void;
  onClose: () => void;
}

export const SkillTreeModal: React.FC<SkillTreeModalProps> = ({
  techUpgrades,
  totalCoins,
  onUpgradeTech,
  onClose
}) => {
  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900/95 border border-white/15 rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="text-cyan-400" size={20} />
            <h2 className="text-xl font-black text-white">TECH RESEARCH LAB</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950 border border-white/10 px-3 py-1 rounded-xl flex items-center gap-1.5 text-yellow-400 font-bold text-xs">
              <Coins size={13} />
              <span>{totalCoins}</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800 border border-white/10"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Upgrade Nodes List */}
        <div className="flex flex-col gap-3 overflow-y-auto pr-1 py-1">
          {techUpgrades.map(tech => {
            const isMax = tech.currentLevel >= tech.maxLevel;
            const cost = Math.round(tech.baseCost * Math.pow(tech.costMultiplier, tech.currentLevel - 1));
            const canAfford = totalCoins >= cost && !isMax;

            return (
              <div
                key={tech.id}
                className="bg-slate-950/60 border border-white/10 p-3.5 rounded-2xl flex items-center justify-between gap-3 hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-2xl shadow-inner">
                    {tech.icon}
                  </div>

                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-sm">{tech.name}</h3>
                      <span className="text-[10px] font-black uppercase bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded-full">
                        Lv. {tech.currentLevel} / {tech.maxLevel}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{tech.description}</p>
                    <p className="text-emerald-400 text-[11px] font-bold mt-1">{tech.statBonusText}</p>
                  </div>
                </div>

                <div>
                  <button
                    disabled={!canAfford || isMax}
                    onClick={() => onUpgradeTech(tech.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 shadow-md ${
                      isMax
                        ? 'bg-slate-800 text-slate-500 cursor-default'
                        : canAfford
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white active:scale-95'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isMax ? (
                      <span>MAX</span>
                    ) : (
                      <>
                        <ArrowUpCircle size={13} />
                        <span>{cost} 🪙</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
