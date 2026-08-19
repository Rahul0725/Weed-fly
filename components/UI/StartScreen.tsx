import React from 'react';
import { Play, Sparkles, Trophy, ShoppingBag, Award, Volume2, VolumeX, Cpu, Target, Gamepad2 } from 'lucide-react';
import { Skin, GameMode } from '../../types';

interface StartScreenProps {
  highScore: number;
  coins: number;
  equippedSkin: Skin;
  isMuted: boolean;
  selectedMode: GameMode;
  isGamepadConnected: boolean;
  onSelectMode: (mode: GameMode) => void;
  onStart: () => void;
  onOpenShop: () => void;
  onOpenTechTree: () => void;
  onOpenBounties: () => void;
  onOpenAchievements: () => void;
  onToggleMute: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  highScore,
  coins,
  equippedSkin,
  isMuted,
  selectedMode,
  isGamepadConnected,
  onSelectMode,
  onStart,
  onOpenShop,
  onOpenTechTree,
  onOpenBounties,
  onOpenAchievements,
  onToggleMute
}) => {
  const modes: { id: GameMode; label: string; desc: string; icon: string }[] = [
    { id: 'arcade', label: 'Classic Arcade', desc: '5 Biomes & powerups', icon: '🌲' },
    { id: 'boss_raid', label: 'Boss Raid', desc: 'Cyber Titan battle', icon: '👾' },
    { id: 'time_dash', label: 'Time Dash', desc: 'Speed gate dash', icon: '⏱️' },
    { id: 'graze_master', label: 'Graze Frenzy', desc: 'Hazard gauntlet', icon: '⚡' }
  ];

  return (
    <div className="absolute inset-0 bg-transparent flex flex-col items-center justify-between p-4 z-40 select-none overflow-y-auto pointer-events-none font-sans">
      {/* Top Header Controls */}
      <div className="w-full flex items-center justify-between max-w-sm pointer-events-auto">
        <div className="flex items-center gap-2 bg-slate-950/75 backdrop-blur-xl border border-white/20 px-3.5 py-1.5 rounded-2xl shadow-lg">
          <span className="text-yellow-400 font-black text-sm">🪙 {coins}</span>
        </div>

        <div className="flex items-center gap-2">
          {isGamepadConnected && (
            <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-md">
              <Gamepad2 size={14} /> Gamepad
            </div>
          )}

          <button
            onClick={onToggleMute}
            className="bg-slate-950/75 hover:bg-slate-900 text-white p-2.5 rounded-2xl border border-white/20 shadow-lg transition-transform active:scale-95 backdrop-blur-xl"
          >
            {isMuted ? <VolumeX size={18} className="text-rose-400" /> : <Volume2 size={18} className="text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Floating Center Hero Card */}
      <div className="bg-slate-950/85 backdrop-blur-2xl border border-white/20 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] max-w-sm w-full flex flex-col items-center gap-3.5 my-auto pointer-events-auto">
        {/* Animated Avatar Emblem */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-[0_0_30px_rgba(20,184,166,0.6)] flex items-center justify-center animate-bounce-slow">
            <span className="text-3xl">{equippedSkin.emoji}</span>
          </div>
          <div className="absolute -bottom-2 bg-slate-900 text-emerald-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-500/40 tracking-wider shadow-md">
            {equippedSkin.name}
          </div>
        </div>

        {/* Game Title */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-md">
            AERO <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">ODYSSEY</span>
          </h1>
          <p className="text-slate-400 text-[11px] font-medium mt-0.5">Eclipse Definitive Edition</p>
        </div>

        {/* Mode Selector Tabs (2x2 Grid) */}
        <div className="grid grid-cols-2 gap-2 w-full">
          {modes.map(m => (
            <button
              key={m.id}
              onClick={() => onSelectMode(m.id)}
              className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 ${
                selectedMode === m.id
                  ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-md'
                  : 'bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20'
              }`}
            >
              <span className="text-lg">{m.icon}</span>
              <div>
                <p className="text-[11px] font-bold text-white leading-tight">{m.label}</p>
                <p className="text-[9px] text-slate-400 line-clamp-1">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Start Game Button (Large, Vibrant, Instant-Click) */}
        <button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:brightness-110 active:scale-[0.98] text-white text-base font-black py-3 px-6 rounded-2xl shadow-[0_10px_25px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2 border-t border-white/40 cursor-pointer"
        >
          <Play fill="currentColor" size={18} />
          <span>START {selectedMode.toUpperCase()}</span>
        </button>

        {/* Sub-Navigation Grid (Hangar, Tech Lab, Bounties, Achievements) */}
        <div className="grid grid-cols-4 gap-2 w-full">
          <button
            onClick={onOpenShop}
            className="bg-slate-900/90 hover:bg-slate-800 text-white font-bold p-2 rounded-xl border border-white/15 shadow-md flex flex-col items-center justify-center gap-1 transition-all active:scale-95 text-[10px]"
          >
            <ShoppingBag size={14} className="text-pink-400" />
            <span>Hangar</span>
          </button>

          <button
            onClick={onOpenTechTree}
            className="bg-slate-900/90 hover:bg-slate-800 text-white font-bold p-2 rounded-xl border border-white/15 shadow-md flex flex-col items-center justify-center gap-1 transition-all active:scale-95 text-[10px]"
          >
            <Cpu size={14} className="text-cyan-400" />
            <span>Tech Lab</span>
          </button>

          <button
            onClick={onOpenBounties}
            className="bg-slate-900/90 hover:bg-slate-800 text-white font-bold p-2 rounded-xl border border-white/15 shadow-md flex flex-col items-center justify-center gap-1 transition-all active:scale-95 text-[10px]"
          >
            <Target size={14} className="text-amber-400" />
            <span>Bounties</span>
          </button>

          <button
            onClick={onOpenAchievements}
            className="bg-slate-900/90 hover:bg-slate-800 text-white font-bold p-2 rounded-xl border border-white/15 shadow-md flex flex-col items-center justify-center gap-1 transition-all active:scale-95 text-[10px]"
          >
            <Award size={14} className="text-emerald-400" />
            <span>Trophies</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-slate-400 text-xs flex items-center gap-1.5 bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 pointer-events-auto shadow-md">
        <Sparkles size={12} className="text-emerald-400" />
        <span>Tap Screen / Spacebar to Flap</span>
      </div>
    </div>
  );
};
