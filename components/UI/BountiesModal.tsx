import React, { useState } from 'react';
import { X, Target, BookOpen, CheckCircle2, Circle } from 'lucide-react';
import { DailyBounty, BestiaryEntry } from '../../types';

interface BountiesModalProps {
  bounties: DailyBounty[];
  bestiary: BestiaryEntry[];
  onClose: () => void;
}

export const BountiesModal: React.FC<BountiesModalProps> = ({
  bounties,
  bestiary,
  onClose
}) => {
  const [tab, setTab] = useState<'bounties' | 'bestiary'>('bounties');

  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900/95 border border-white/15 rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 max-h-[90vh]">
        {/* Header with Tab Switcher */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab('bounties')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                tab === 'bounties' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Target size={14} />
              <span>Daily Bounties</span>
            </button>

            <button
              onClick={() => setTab('bestiary')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                tab === 'bestiary' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen size={14} />
              <span>Lore Bestiary</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800 border border-white/10"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex flex-col gap-3 overflow-y-auto pr-1 py-1">
          {tab === 'bounties' ? (
            bounties.map(b => {
              const pct = Math.min(100, Math.round((b.progress / b.target) * 100));

              return (
                <div
                  key={b.id}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3.5 ${
                    b.completed ? 'bg-amber-950/30 border-amber-500/40' : 'bg-slate-950/60 border-white/10'
                  }`}
                >
                  <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-xl">
                    {b.icon}
                  </div>

                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-sm">{b.title}</h3>
                      <span className="text-[11px] font-black text-amber-400">+{b.rewardCoins} 🪙</span>
                    </div>
                    <p className="text-slate-400 text-xs mt-0.5">{b.description}</p>

                    <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>

                  <div>
                    {b.completed ? (
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    ) : (
                      <Circle size={18} className="text-slate-600" />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            bestiary.map(entry => (
              <div key={entry.id} className="bg-slate-950/60 border border-white/10 p-3.5 rounded-2xl flex flex-col gap-2 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 flex items-center justify-center text-xl">
                    {entry.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{entry.title}</h3>
                    <p className="text-indigo-400 text-[10px] uppercase font-bold">{entry.subtitle}</p>
                  </div>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">{entry.description}</p>
                <p className="text-slate-400 text-[11px] italic bg-black/30 p-2 rounded-xl border border-white/5">{entry.lore}</p>

                <div className="grid grid-cols-3 gap-1.5 text-center mt-1">
                  {Object.entries(entry.stats).map(([k, v]) => (
                    <div key={k} className="bg-slate-900/60 p-1.5 rounded-lg border border-white/5">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">{k}</span>
                      <span className="text-xs font-black text-slate-200">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
