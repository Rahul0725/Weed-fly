import React from 'react';
import { ActivePowerUp, Biome, BossEntity, GameMode } from '../../types';
import { Pause, Trophy, Coins, Zap, Skull, Shield, Clock, Magnet, Rocket } from 'lucide-react';

interface HUDProps {
  score: number;
  highScore: number;
  coins: number;
  combo: number;
  multiplier: number;
  activePowerUps: ActivePowerUp[];
  biome: Biome;
  gameMode: GameMode;
  boss?: BossEntity | null;
  onPause: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  score,
  highScore,
  coins,
  combo,
  multiplier,
  activePowerUps,
  biome,
  gameMode,
  boss,
  onPause
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 md:p-6 select-none font-sans">
      {/* Top Bar */}
      <div className="flex items-start justify-between w-full">
        {/* Left: Biome & Stats Pill */}
        <div className="flex flex-col gap-2">
          <div className="bg-slate-950/75 backdrop-blur-xl border border-white/20 px-4 py-1.5 rounded-2xl flex items-center gap-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-100">{biome.name}</span>
            <span className="text-[10px] font-black uppercase text-cyan-300 bg-cyan-900/60 border border-cyan-400/30 px-2 py-0.5 rounded-lg shadow-sm">
              {gameMode}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="bg-slate-950/70 backdrop-blur-md border border-yellow-500/30 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-yellow-400 text-sm font-black shadow-lg">
              <Coins size={15} className="animate-spin" style={{ animationDuration: '4s' }} />
              <span>{coins}</span>
            </div>
            <div className="bg-slate-950/70 backdrop-blur-md border border-amber-500/30 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-slate-200 text-sm font-bold shadow-lg">
              <Trophy size={14} className="text-amber-400" />
              <span>{highScore}</span>
            </div>
          </div>
        </div>

        {/* Center: Big Animated Score & Multiplier */}
        <div className="flex flex-col items-center">
          <span className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-300 drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] tracking-tight font-mono">
            {score}
          </span>
          {multiplier > 1 && (
            <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-fuchsia-500 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest animate-bounce shadow-[0_0_15px_rgba(244,63,94,0.6)] border border-white/40 flex items-center gap-1.5 mt-1">
              <Zap size={13} className="text-yellow-200 animate-pulse" /> {multiplier}x COMBO ({combo})
            </div>
          )}
        </div>

        {/* Right: Pause Button */}
        <button
          onClick={onPause}
          className="pointer-events-auto bg-slate-950/75 hover:bg-slate-900 active:scale-90 transition-all text-white p-3.5 rounded-2xl border border-white/20 backdrop-blur-xl shadow-[0_8px_25px_rgba(0,0,0,0.6)]"
          title="Pause Game"
        >
          <Pause size={18} />
        </button>
      </div>

      {/* Boss Health Bar if active */}
      {boss && !boss.defeated && (
        <div className="w-full max-w-md mx-auto bg-slate-950/90 border border-rose-500/60 p-3 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(244,63,94,0.4)] animate-pulse">
          <div className="flex items-center justify-between text-xs font-black text-rose-300 mb-1.5">
            <span className="flex items-center gap-1.5"><Skull size={15} className="text-rose-400" /> {boss.name}</span>
            <span className="font-mono">{boss.health} / {boss.maxHealth} HP</span>
          </div>
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/15 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 rounded-full transition-all duration-150 shadow-[0_0_10px_rgba(244,63,94,0.8)]"
              style={{ width: `${Math.max(0, (boss.health / boss.maxHealth) * 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Bottom: Active Powerup Badges with SVG Cooldown Circles */}
      <div className="flex items-center justify-center gap-3 pb-6">
        {activePowerUps.map(p => {
          const powerIcons: Record<string, { label: string; icon: React.ReactNode; color: string; border: string }> = {
            shield: { label: 'SHIELD', icon: <Shield size={14} />, color: '#38bdf8', border: 'border-sky-400' },
            slowmo: { label: 'SLOW-MO', icon: <Clock size={14} />, color: '#c084fc', border: 'border-purple-400' },
            magnet: { label: 'MAGNET', icon: <Magnet size={14} />, color: '#f472b6', border: 'border-rose-400' },
            boost: { label: 'HYPER', icon: <Rocket size={14} />, color: '#fbbf24', border: 'border-amber-400' }
          };
          const conf = powerIcons[p.type] || powerIcons.shield;
          const pct = Math.min(1, Math.max(0, p.durationLeft / p.maxDuration));
          const circumference = 2 * Math.PI * 10;
          const strokeDashoffset = circumference * (1 - pct);

          return (
            <div
              key={p.type}
              className={`bg-slate-950/85 border ${conf.border} text-white px-3.5 py-1.5 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.6)] flex items-center gap-2.5 backdrop-blur-xl`}
            >
              {/* SVG Circular Progress Ring */}
              <div className="relative w-6 h-6 flex items-center justify-center">
                <svg className="w-6 h-6 -rotate-90">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" fill="none" />
                  {p.type !== 'shield' && (
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke={conf.color}
                      strokeWidth="2.5"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  )}
                </svg>
                <div className="absolute text-white" style={{ color: conf.color }}>
                  {conf.icon}
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] font-black tracking-wider leading-none" style={{ color: conf.color }}>
                  {conf.label}
                </span>
                {p.type !== 'shield' && (
                  <span className="text-[9px] font-bold text-slate-400 font-mono leading-none mt-0.5">
                    {p.durationLeft.toFixed(1)}s
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
