/**
 * TOPOLOGICA: 4D Sandbox Lab & Topological Physics Parameter Tweaker
 */

import React from 'react';
import { SandboxParameters } from '../../game/types';

interface SandboxLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: SandboxParameters;
  onChangeParams: (params: SandboxParameters) => void;
  onEnterSandboxMode: () => void;
}

export const SandboxLabModal: React.FC<SandboxLabModalProps> = ({
  isOpen,
  onClose,
  params,
  onChangeParams,
  onEnterSandboxMode
}) => {
  if (!isOpen) return null;

  const manifoldNames = [
    '4D Gyroid Minimal Surface',
    '4D Hopf Fibration (Clifford Tori)',
    '4D Calabi-Yau Compactified Fold',
    '4D Möbius Non-Orientable Ribbon',
    '4D Schwarzschild Gravitational Core',
    '4D Tesseract Hypercube Lattice',
    '4D Mandelbulb Quaternion Fractal',
    '4D Omega Grand Convergence'
  ];

  const colorPalettes = [
    { name: 'Cosmic Violet', ambient: [0.35, 0.15, 0.5], glow: [0.8, 0.35, 1.0] },
    { name: 'Cyan Nebula', ambient: [0.08, 0.35, 0.45], glow: [0.1, 0.95, 0.85] },
    { name: 'Solar Amber', ambient: [0.45, 0.2, 0.1], glow: [1.0, 0.6, 0.15] },
    { name: 'Emerald Void', ambient: [0.1, 0.35, 0.25], glow: [0.25, 1.0, 0.6] },
    { name: 'Monochrome Matrix', ambient: [0.2, 0.2, 0.25], glow: [0.9, 0.95, 1.0] }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-slate-950 border border-teal-500/40 rounded-3xl p-6 max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl shadow-teal-950/80">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧪</span>
            <div>
              <h2 className="text-lg font-mono font-black text-white tracking-wider uppercase">
                4D Sandbox & Manifold Physics Lab
              </h2>
              <p className="text-xs font-mono text-teal-400">
                Directly manipulate non-Euclidean mathematical equations and shader parameters
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

        {/* Sliders and Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-1">
          {/* Manifold Equation Selector */}
          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-mono font-bold text-slate-300">
              Active 4D Mathematical Equation:
            </label>
            <select
              value={params.manifoldType}
              onChange={(e) => onChangeParams({ ...params, manifoldType: parseInt(e.target.value) })}
              className="bg-slate-900 border border-slate-700 text-teal-300 font-mono text-xs p-2.5 rounded-xl outline-none focus:border-teal-400"
            >
              {manifoldNames.map((name, idx) => (
                <option key={idx} value={idx}>
                  {idx + 1}. {name}
                </option>
              ))}
            </select>
          </div>

          {/* Alpha: Spatial Curvature */}
          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-sky-300">α Spatial Curvature</span>
              <span className="text-sky-400 font-bold">{params.alpha.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6.0"
              step="0.05"
              value={params.alpha}
              onChange={(e) => onChangeParams({ ...params, alpha: parseFloat(e.target.value) })}
              className="accent-sky-400"
            />
          </div>

          {/* Beta: Temporal Viscosity */}
          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-violet-300">β Temporal Viscosity</span>
              <span className="text-violet-400 font-bold">{params.beta.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6.0"
              step="0.05"
              value={params.beta}
              onChange={(e) => onChangeParams({ ...params, beta: parseFloat(e.target.value) })}
              className="accent-violet-400"
            />
          </div>

          {/* Gamma: Hyper-Phase */}
          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-emerald-300">γ 4D Hyper-Phase Angle</span>
              <span className="text-emerald-400 font-bold">{((params.gamma * 180) / Math.PI).toFixed(0)}°</span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.PI * 2}
              step="0.05"
              value={params.gamma}
              onChange={(e) => onChangeParams({ ...params, gamma: parseFloat(e.target.value) })}
              className="accent-emerald-400"
            />
          </div>

          {/* Gravitational Warp */}
          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-amber-300">Gravitational Lensing Warp</span>
              <span className="text-amber-400 font-bold">{params.gravitationalWarp.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.02"
              value={params.gravitationalWarp}
              onChange={(e) => onChangeParams({ ...params, gravitationalWarp: parseFloat(e.target.value) })}
              className="accent-amber-400"
            />
          </div>

          {/* Surface Distortion */}
          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-rose-300">Surface Distortion Wave</span>
              <span className="text-rose-400 font-bold">{params.surfaceDistortion.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.8"
              step="0.02"
              value={params.surfaceDistortion}
              onChange={(e) => onChangeParams({ ...params, surfaceDistortion: parseFloat(e.target.value) })}
              className="accent-rose-400"
            />
          </div>

          {/* Color Palette */}
          <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-1">
            <label className="text-xs font-mono text-slate-300">Photonic Color Palette:</label>
            <select
              value={params.colorScheme}
              onChange={(e) => onChangeParams({ ...params, colorScheme: parseInt(e.target.value) })}
              className="bg-slate-950 border border-slate-700 text-slate-200 font-mono text-xs p-2 rounded-lg"
            >
              {colorPalettes.map((p, idx) => (
                <option key={idx} value={idx}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-4">
          <button
            onClick={() =>
              onChangeParams({
                manifoldType: 0,
                alpha: 2.0,
                beta: 2.0,
                gamma: 0.0,
                surfaceDistortion: 0.1,
                glowIntensity: 1.0,
                gravitationalWarp: 0.25,
                fogDensity: 0.08,
                colorScheme: 0,
                particleSpeed: 1.0,
                particleCount: 500,
                lightOrbitSpeed: 1.0
              })
            }
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-mono text-xs transition border border-slate-800"
          >
            Reset Defaults
          </button>

          <button
            onClick={() => {
              onEnterSandboxMode();
              onClose();
            }}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-mono font-bold text-xs shadow-md transition"
          >
            Launch Sandbox Mode
          </button>
        </div>
      </div>
    </div>
  );
};
