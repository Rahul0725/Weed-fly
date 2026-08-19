import React, { useState } from 'react';
import { X, Check, Lock, Sparkles, Coins, Palette } from 'lucide-react';
import { Skin, TrailTheme } from '../../types';

interface ShopModalProps {
  skins: Skin[];
  trailThemes: TrailTheme[];
  equippedSkinId: string;
  equippedTrailId: string;
  totalCoins: number;
  onSelectSkin: (skinId: string) => void;
  onUnlockSkin: (skin: Skin) => void;
  onSelectTrail: (trailId: string) => void;
  onUnlockTrail: (trail: TrailTheme) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  skins,
  trailThemes,
  equippedSkinId,
  equippedTrailId,
  totalCoins,
  onSelectSkin,
  onUnlockSkin,
  onSelectTrail,
  onUnlockTrail,
  onClose
}) => {
  const [tab, setTab] = useState<'skins' | 'trails'>('skins');

  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900/95 border border-white/15 rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 max-h-[90vh]">
        {/* Header with Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab('skins')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                tab === 'skins' ? 'bg-pink-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles size={14} />
              <span>Skins</span>
            </button>

            <button
              onClick={() => setTab('trails')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                tab === 'trails' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Palette size={14} />
              <span>Trail Themes</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950 border border-white/10 px-3 py-1 rounded-xl flex items-center gap-1.5 text-yellow-400 font-bold text-xs">
              <Coins size={13} />
              <span>{totalCoins}</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800 border border-white/10"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content List */}
        <div className="flex flex-col gap-3 overflow-y-auto pr-1 py-1">
          {tab === 'skins' ? (
            skins.map(skin => {
              const isEquipped = skin.id === equippedSkinId;
              const canAfford = totalCoins >= skin.cost;

              return (
                <div
                  key={skin.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isEquipped
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'bg-slate-950/50 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md relative"
                      style={{ backgroundColor: skin.primaryColor + '25', border: `2px solid ${skin.primaryColor}` }}
                    >
                      <span>{skin.emoji}</span>
                      <div
                        className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900"
                        style={{ backgroundColor: skin.trailColor }}
                      ></div>
                    </div>

                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-white text-sm">{skin.name}</h3>
                        {isEquipped && (
                          <span className="text-[10px] uppercase font-black bg-emerald-500 text-white px-1.5 py-0.2 rounded-full">
                            EQUIPPED
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{skin.description}</p>
                    </div>
                  </div>

                  <div>
                    {skin.isUnlocked ? (
                      <button
                        disabled={isEquipped}
                        onClick={() => onSelectSkin(skin.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 ${
                          isEquipped
                            ? 'bg-emerald-500/20 text-emerald-300 cursor-default'
                            : 'bg-slate-800 hover:bg-slate-700 text-white active:scale-95'
                        }`}
                      >
                        {isEquipped ? <Check size={13} /> : null}
                        <span>{isEquipped ? 'Active' : 'Equip'}</span>
                      </button>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => onUnlockSkin(skin)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 shadow-md ${
                          canAfford
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-white active:scale-95'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Lock size={12} />
                        <span>{skin.cost} 🪙</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            trailThemes.map(trail => {
              const isEquipped = trail.id === equippedTrailId;
              const canAfford = totalCoins >= trail.cost;

              return (
                <div
                  key={trail.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isEquipped
                      ? 'bg-purple-950/40 border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                      : 'bg-slate-950/50 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center gap-1 p-2">
                      {trail.colors.map((c, i) => (
                        <div key={i} className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: c }}></div>
                      ))}
                    </div>

                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-white text-sm">{trail.name}</h3>
                        {isEquipped && (
                          <span className="text-[10px] uppercase font-black bg-purple-500 text-white px-1.5 py-0.2 rounded-full">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs mt-0.5">Particle shape: {trail.particleShape}</p>
                    </div>
                  </div>

                  <div>
                    {trail.isUnlocked ? (
                      <button
                        disabled={isEquipped}
                        onClick={() => onSelectTrail(trail.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 ${
                          isEquipped
                            ? 'bg-purple-500/20 text-purple-300 cursor-default'
                            : 'bg-slate-800 hover:bg-slate-700 text-white active:scale-95'
                        }`}
                      >
                        {isEquipped ? <Check size={13} /> : null}
                        <span>{isEquipped ? 'Active' : 'Equip'}</span>
                      </button>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => onUnlockTrail(trail)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 shadow-md ${
                          canAfford
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-white active:scale-95'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Lock size={12} />
                        <span>{trail.cost} 🪙</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
