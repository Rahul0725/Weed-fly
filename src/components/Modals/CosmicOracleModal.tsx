/**
 * TOPOLOGICA: Gemini AI 4D Cosmic Oracle Modal
 */

import React, { useState, useEffect } from 'react';
import { geminiOracleService, OracleProphecy } from '../../services/geminiOracleService';
import { HarmonicRatioLock, SectorConfig } from '../../game/types';

interface CosmicOracleModalProps {
  isOpen: boolean;
  onClose: () => void;
  sector: SectorConfig;
  score: number;
  harmonicLock: HarmonicRatioLock;
  totalStabilizations: number;
  entropy: number;
}

export const CosmicOracleModal: React.FC<CosmicOracleModalProps> = ({
  isOpen,
  onClose,
  sector,
  score,
  harmonicLock,
  totalStabilizations,
  entropy
}) => {
  const [loading, setLoading] = useState(false);
  const [prophecy, setProphecy] = useState<OracleProphecy | null>(null);

  const fetchProphecy = async () => {
    setLoading(true);
    const res = await geminiOracleService.consultOracle(
      sector,
      score,
      harmonicLock,
      totalStabilizations,
      entropy
    );
    setProphecy(res);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchProphecy();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-slate-950 border border-indigo-500/40 rounded-3xl p-6 max-w-2xl w-full flex flex-col shadow-2xl shadow-indigo-950/80">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-pulse">🔮</span>
            <div>
              <h2 className="text-lg font-mono font-black text-white tracking-wider uppercase">
                4D Trans-Dimensional Cosmic Oracle
              </h2>
              <p className="text-xs font-mono text-indigo-400">
                Powered by Gemini Multi-Dimensional Consciousness
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

        {/* Oracle Response */}
        <div className="flex flex-col gap-4 py-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <div className="text-xs font-mono text-indigo-300 animate-pulse">
                Attuning to 4th Dimensional Quantum Vibrations...
              </div>
            </div>
          ) : prophecy ? (
            <>
              {/* Cosmic Revelation */}
              <div className="bg-indigo-950/40 border border-indigo-500/30 p-5 rounded-2xl">
                <div className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold mb-2">
                  🌌 Cosmic Revelation
                </div>
                <p className="text-sm font-sans italic text-indigo-100 leading-relaxed">
                  "{prophecy.prophecy}"
                </p>
              </div>

              {/* Mathematical Insight */}
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1">
                  📐 Topological Resonance Analysis
                </div>
                <p className="text-xs font-mono text-slate-300">
                  {prophecy.harmonicInsight}
                </p>
              </div>

              {/* Boon Granted */}
              <div className="bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-950 border border-amber-500/40 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                    ✨ Active Oracle Blessing
                  </div>
                  <div className="text-xs font-mono font-bold text-amber-200 mt-0.5">
                    {prophecy.boonName}
                  </div>
                  <div className="text-[11px] font-sans text-slate-400">
                    {prophecy.boonDescription}
                  </div>
                </div>
                <div className="text-amber-400 font-mono font-black text-sm px-3 py-1 bg-amber-950/60 rounded-lg border border-amber-600/40">
                  ACTIVE
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-4">
          <button
            onClick={fetchProphecy}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs transition border border-slate-700"
          >
            🔄 Re-Attune Waveform
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-mono font-bold text-xs shadow-md transition"
          >
            Accept Blessing
          </button>
        </div>
      </div>
    </div>
  );
};
