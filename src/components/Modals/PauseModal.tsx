/**
 * TOPOLOGICA: Pause & Audio Settings Modal
 */

import React from 'react';
import { SoundSettings } from '../../game/types';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onOpenAtlas: () => void;
  soundSettings: SoundSettings;
  onUpdateSoundSettings: (settings: SoundSettings) => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRestart,
  onOpenAtlas,
  soundSettings,
  onUpdateSoundSettings
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-slate-950 border border-slate-700/60 rounded-3xl p-6 max-w-md w-full flex flex-col shadow-2xl shadow-black/90">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h2 className="text-base font-mono font-black text-white tracking-widest uppercase">
            Simulation Paused
          </h2>
          <button
            onClick={onResume}
            className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-mono font-bold transition border border-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Audio Volume Controls */}
        <div className="flex flex-col gap-3 mb-6 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <div className="text-xs font-mono font-bold text-cyan-400 uppercase mb-1">
            🔊 Generative Audio Mixer
          </div>

          {/* Master Volume */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-300">
              <span>Master Volume</span>
              <span>{(soundSettings.masterVolume * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={soundSettings.masterVolume}
              onChange={(e) => onUpdateSoundSettings({ ...soundSettings, masterVolume: parseFloat(e.target.value) })}
              className="accent-cyan-400"
            />
          </div>

          {/* Music Volume */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-300">
              <span>Synesthetic Drone Synthesizer</span>
              <span>{(soundSettings.musicVolume * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={soundSettings.musicVolume}
              onChange={(e) => onUpdateSoundSettings({ ...soundSettings, musicVolume: parseFloat(e.target.value) })}
              className="accent-violet-400"
            />
          </div>

          {/* SFX Volume */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-300">
              <span>Resonance & Collapse SFX</span>
              <span>{(soundSettings.sfxVolume * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={soundSettings.sfxVolume}
              onChange={(e) => onUpdateSoundSettings({ ...soundSettings, sfxVolume: parseFloat(e.target.value) })}
              className="accent-amber-400"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onResume}
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs shadow-md transition"
          >
            Resume Simulation
          </button>
          <button
            onClick={onRestart}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-mono text-xs font-bold transition border border-slate-800"
          >
            Restart Sector
          </button>
          <button
            onClick={onOpenAtlas}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs transition border border-slate-800"
          >
            Return to Sector Atlas
          </button>
        </div>
      </div>
    </div>
  );
};
