import React from 'react';
import { RotateCcw, Trophy, Award, Zap, Coins, Sparkles } from 'lucide-react';
import { RunStatistics } from '../../types';

interface GameOverModalProps {
  stats: RunStatistics;
  highScore: number;
  aiCommentary: string;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  highScore,
  aiCommentary,
  onRestart
}) => {
  // Determine Medal Tier
  let medal = { name: 'Bronze Pilot', color: 'from-amber-700 to-amber-900', emoji: '🥉' };
  if (stats.score >= 50) medal = { name: 'Diamond Legend', color: 'from-cyan-400 to-blue-600', emoji: '💎' };
  else if (stats.score >= 25) medal = { name: 'Gold Ace', color: 'from-yellow-400 to-amber-600', emoji: '🥇' };
  else if (stats.score >= 10) medal = { name: 'Silver Aviator', color: 'from-slate-300 to-slate-500', emoji: '🥈' };

  return (
    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900/90 border border-white/15 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl flex flex-col gap-5 text-center relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Title */}
        <div>
          {stats.newHighScore ? (
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2 shadow-lg animate-bounce">
              <Sparkles size={13} /> NEW RECORD!
            </div>
          ) : (
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400">FLIGHT TERMINATED</span>
          )}
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">GAME OVER</h2>
        </div>

        {/* Medal & Primary Score Display */}
        <div className="bg-slate-950/60 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${medal.color} flex items-center justify-center text-2xl shadow-md`}>
              {medal.emoji}
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Honor Tier</p>
              <p className="text-sm font-black text-white">{medal.name}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Final Score</p>
            <p className="text-3xl font-black text-emerald-400">{stats.score}</p>
          </div>
        </div>

        {/* Run Analytics Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-950/40 border border-white/5 p-2.5 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-bold mb-0.5">
              <Trophy size={11} /> Best
            </div>
            <span className="text-lg font-black text-white">{highScore}</span>
          </div>

          <div className="bg-slate-950/40 border border-white/5 p-2.5 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-yellow-400 text-xs font-bold mb-0.5">
              <Coins size={11} /> Coins
            </div>
            <span className="text-lg font-black text-white">+{stats.coinsCollected}</span>
          </div>

          <div className="bg-slate-950/40 border border-white/5 p-2.5 rounded-xl">
            <div className="flex items-center justify-center gap-1 text-rose-400 text-xs font-bold mb-0.5">
              <Zap size={11} /> Grazes
            </div>
            <span className="text-lg font-black text-white">{stats.nearMisses}</span>
          </div>
        </div>

        {/* AI Announcer Roast / Praise Card */}
        {aiCommentary && (
          <div className="bg-gradient-to-r from-purple-950/50 to-indigo-950/50 border border-purple-500/20 p-3 rounded-xl text-left flex items-start gap-2.5 shadow-inner">
            <span className="text-lg">🤖</span>
            <div>
              <p className="text-[10px] uppercase font-black text-purple-300 tracking-wider">AI Announcer</p>
              <p className="text-xs text-slate-200 font-medium italic mt-0.5 leading-relaxed">"{aiCommentary}"</p>
            </div>
          </div>
        )}

        {/* Play Again Button */}
        <button
          onClick={onRestart}
          className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:brightness-110 active:scale-[0.98] text-white text-lg font-black py-3.5 px-6 rounded-2xl shadow-[0_8px_20px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2 border-t border-white/30"
        >
          <RotateCcw size={20} />
          <span>PLAY AGAIN</span>
        </button>
      </div>
    </div>
  );
};
