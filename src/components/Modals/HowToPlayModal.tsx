/**
 * TOPOLOGICA: How to Play & 4D Mechanics Guide Modal
 */

import React from 'react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-slate-950 border border-cyan-500/40 rounded-3xl p-6 max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl shadow-cyan-950/80">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📐</span>
            <div>
              <h2 className="text-lg font-mono font-black text-white tracking-wider uppercase">
                How to Play: 4D Resonance Architect
              </h2>
              <p className="text-xs font-mono text-cyan-400">
                Mastering the continuous non-Euclidean manifold and harmonic tensor physics
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

        {/* Guide Sections */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-1 text-xs">
          {/* Step 1: Weave Conduits */}
          <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl flex gap-3">
            <div className="text-2xl">🔗</div>
            <div>
              <h3 className="font-mono font-bold text-cyan-300 text-sm mb-1">
                1. Weave Phase-Tether Gravitational Conduits
              </h3>
              <p className="text-slate-300 leading-relaxed font-sans">
                Click and drag from one 4D anomaly singularity to another to anchor a gravitational conduit. Energy will immediately begin circulating across the linked singularities.
              </p>
            </div>
          </div>

          {/* Step 2: Harmonic Ratio Locking */}
          <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl flex gap-3">
            <div className="text-2xl">🎛️</div>
            <div>
              <h3 className="font-mono font-bold text-amber-300 text-sm mb-1">
                2. Tune Harmonic Dials to Sacred Mathematical Ratios
              </h3>
              <p className="text-slate-300 leading-relaxed font-sans">
                Adjust <span className="text-sky-300 font-bold">α (Spatial Curvature)</span> and <span className="text-violet-300 font-bold">β (Temporal Viscosity)</span>. When their ratio matches fundamental mathematical harmonies (3:2 Fifth, 4:3 Fourth, Φ Golden Ratio 1.618, 2:1 Octave, e Euler 2.718), the manifold locks into <span className="text-amber-300 font-bold">Constructive Phase Resonance</span>.
              </p>
            </div>
          </div>

          {/* Step 3: Constructive Collapse */}
          <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl flex gap-3">
            <div className="text-2xl">💥</div>
            <div>
              <h3 className="font-mono font-bold text-emerald-300 text-sm mb-1">
                3. Trigger Constructive Resonance Collapse
              </h3>
              <p className="text-slate-300 leading-relaxed font-sans">
                While in a Harmonic Ratio Lock, linked singularities will supercharge with energy until they undergo a constructive collapse into <span className="text-cyan-300 font-bold">Photonic Crystals</span>. This extinguishes dangerous entropy and awards rich <span className="text-violet-300 font-bold">Chroma-Flux 💎</span>!
              </p>
            </div>
          </div>

          {/* Step 4: 4D Hyper-Phase Rotation */}
          <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl flex gap-3">
            <div className="text-2xl">🌀</div>
            <div>
              <h3 className="font-mono font-bold text-indigo-300 text-sm mb-1">
                4. Rotate the 4D Hyper-Phase (W-Axis Slice)
              </h3>
              <p className="text-slate-300 leading-relaxed font-sans">
                Anomalies inhabit 4 spatial dimensions. Adjust the <span className="text-emerald-300 font-bold">γ dial</span> (or mouse wheel) to rotate the 3D viewing plane through the 4th dimension ($W$-axis). Anomalies faded in the hyper-shadow will phase into full brilliance as you align the angle!
              </p>
            </div>
          </div>

          {/* Step 5: Gravitational Lens */}
          <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl flex gap-3">
            <div className="text-2xl">🔍</div>
            <div>
              <h3 className="font-mono font-bold text-rose-300 text-sm mb-1">
                5. Gravitational Lens Focusing
              </h3>
              <p className="text-slate-300 leading-relaxed font-sans">
                Hold anywhere on the screen (or right click) to focus an intense gravitational lens. This bends light rays around your cursor and pulls wandering singularities toward the focal point.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 mt-4 text-center">
          <button
            onClick={onClose}
            className="px-8 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-black text-xs tracking-wider uppercase shadow-md transition"
          >
            I Understand — Enter the Manifold ➔
          </button>
        </div>
      </div>
    </div>
  );
};
