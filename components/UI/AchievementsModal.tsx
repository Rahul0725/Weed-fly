import React from 'react';
import { X, Award, CheckCircle2, Circle } from 'lucide-react';
import { Achievement } from '../../types';

interface AchievementsModalProps {
  achievements: Achievement[];
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  achievements,
  onClose
}) => {
  const completedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900/95 border border-white/15 rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="text-amber-400" size={20} />
            <h2 className="text-xl font-black text-white">ACHIEVEMENTS</h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-300">
              {completedCount} / {achievements.length} Unlocked
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800 border border-white/10"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col gap-2.5 overflow-y-auto pr-1 py-1">
          {achievements.map(ach => {
            const pct = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border flex items-center gap-3.5 transition-all ${
                  ach.unlocked
                    ? 'bg-amber-950/30 border-amber-500/40 shadow-sm'
                    : 'bg-slate-950/50 border-white/10 opacity-75'
                }`}
              >
                <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-xl shadow-inner">
                  {ach.icon}
                </div>

                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">{ach.title}</h3>
                    <span className="text-[11px] font-black text-amber-400">+{ach.rewardCoins} 🪙</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5">{ach.description}</p>

                  {/* Progress Bar */}
                  {!ach.unlocked && (
                    <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                <div>
                  {ach.unlocked ? (
                    <CheckCircle2 size={18} className="text-emerald-400" />
                  ) : (
                    <Circle size={18} className="text-slate-600" />
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
