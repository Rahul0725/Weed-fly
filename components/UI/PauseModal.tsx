import React from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Home } from 'lucide-react';
import { SoundSettings } from '../../types';

interface PauseModalProps {
  soundSettings: SoundSettings;
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  onUpdateSound: (settings: Partial<SoundSettings>) => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  soundSettings,
  onResume,
  onRestart,
  onHome,
  onUpdateSound
}) => {
  return (
    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none animate-in fade-in duration-150">
      <div className="bg-slate-900/90 border border-white/15 rounded-3xl p-6 md:p-8 max-w-xs w-full shadow-2xl flex flex-col gap-5 text-center">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-slate-400">FLIGHT SUSPENDED</span>
          <h2 className="text-3xl font-black text-white tracking-tight mt-1">PAUSED</h2>
        </div>

        {/* Audio Volume Controls */}
        <div className="bg-slate-950/50 border border-white/10 p-3.5 rounded-2xl flex flex-col gap-3 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Master Sound</span>
            <button
              onClick={() => onUpdateSound({ muted: !soundSettings.muted })}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {soundSettings.muted ? <VolumeX size={16} className="text-rose-400" /> : <Volume2 size={16} className="text-emerald-400" />}
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400">
              <span>SFX Volume</span>
              <span>{Math.round(soundSettings.sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={soundSettings.sfxVolume}
              onChange={(e) => onUpdateSound({ sfxVolume: parseFloat(e.target.value) })}
              className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400">
              <span>Music Volume</span>
              <span>{Math.round(soundSettings.musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={soundSettings.musicVolume}
              onChange={(e) => onUpdateSound({ musicVolume: parseFloat(e.target.value) })}
              className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onResume}
            className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all text-sm"
          >
            <Play fill="currentColor" size={16} />
            <span>RESUME</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold py-2.5 px-4 rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-all text-sm"
          >
            <RotateCcw size={15} />
            <span>RESTART RUN</span>
          </button>

          <button
            onClick={onHome}
            className="w-full bg-slate-900/60 hover:bg-slate-800 active:scale-95 text-slate-400 hover:text-white font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-xs"
          >
            <Home size={14} />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
