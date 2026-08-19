import { SKINS, ACHIEVEMENTS, TECH_UPGRADES, DAILY_BOUNTIES, BESTIARY, TRAIL_THEMES } from '../constants';
import { Skin, TrailTheme, Achievement, TechUpgrade, DailyBounty, BestiaryEntry, SoundSettings } from '../types';

const STORAGE_KEYS = {
  HIGH_SCORE: 'flappy_studio_highscore',
  TOTAL_COINS: 'flappy_studio_coins',
  EQUIPPED_SKIN: 'flappy_studio_equipped_skin',
  EQUIPPED_TRAIL: 'flappy_studio_equipped_trail',
  UNLOCKED_SKINS: 'flappy_studio_unlocked_skins',
  UNLOCKED_TRAILS: 'flappy_studio_unlocked_trails',
  TECH_UPGRADES: 'flappy_studio_tech_upgrades',
  DAILY_BOUNTIES: 'flappy_studio_daily_bounties',
  BESTIARY: 'flappy_studio_bestiary',
  ACHIEVEMENTS: 'flappy_studio_achievements',
  SOUND_SETTINGS: 'flappy_studio_sound'
};

class StorageService {
  getHighScore(): number {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  }

  saveHighScore(score: number) {
    try {
      const current = this.getHighScore();
      if (score > current) {
        localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, score.toString());
      }
    } catch {}
  }

  getCoins(): number {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.TOTAL_COINS);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  }

  addCoins(amount: number): number {
    try {
      const updated = this.getCoins() + amount;
      localStorage.setItem(STORAGE_KEYS.TOTAL_COINS, updated.toString());
      return updated;
    } catch {
      return 0;
    }
  }

  spendCoins(amount: number): boolean {
    const current = this.getCoins();
    if (current >= amount) {
      try {
        localStorage.setItem(STORAGE_KEYS.TOTAL_COINS, (current - amount).toString());
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }

  getEquippedSkinId(): string {
    try {
      return localStorage.getItem(STORAGE_KEYS.EQUIPPED_SKIN) || 'phoenix';
    } catch {
      return 'phoenix';
    }
  }

  setEquippedSkinId(skinId: string) {
    try {
      localStorage.setItem(STORAGE_KEYS.EQUIPPED_SKIN, skinId);
    } catch {}
  }

  getEquippedTrailId(): string {
    try {
      return localStorage.getItem(STORAGE_KEYS.EQUIPPED_TRAIL) || 'solar_flare';
    } catch {
      return 'solar_flare';
    }
  }

  setEquippedTrailId(trailId: string) {
    try {
      localStorage.setItem(STORAGE_KEYS.EQUIPPED_TRAIL, trailId);
    } catch {}
  }

  getSkins(): Skin[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.UNLOCKED_SKINS);
      const unlockedIds: string[] = saved ? JSON.parse(saved) : ['phoenix'];
      return SKINS.map(s => ({
        ...s,
        isUnlocked: s.cost === 0 || unlockedIds.includes(s.id)
      }));
    } catch {
      return SKINS;
    }
  }

  unlockSkin(skinId: string): boolean {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.UNLOCKED_SKINS);
      const unlockedIds: string[] = saved ? JSON.parse(saved) : ['phoenix'];
      if (!unlockedIds.includes(skinId)) {
        unlockedIds.push(skinId);
        localStorage.setItem(STORAGE_KEYS.UNLOCKED_SKINS, JSON.stringify(unlockedIds));
        return true;
      }
    } catch {}
    return false;
  }

  getTrailThemes(): TrailTheme[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.UNLOCKED_TRAILS);
      const unlockedIds: string[] = saved ? JSON.parse(saved) : ['solar_flare'];
      return TRAIL_THEMES.map(t => ({
        ...t,
        isUnlocked: t.cost === 0 || unlockedIds.includes(t.id)
      }));
    } catch {
      return TRAIL_THEMES;
    }
  }

  unlockTrailTheme(trailId: string): boolean {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.UNLOCKED_TRAILS);
      const unlockedIds: string[] = saved ? JSON.parse(saved) : ['solar_flare'];
      if (!unlockedIds.includes(trailId)) {
        unlockedIds.push(trailId);
        localStorage.setItem(STORAGE_KEYS.UNLOCKED_TRAILS, JSON.stringify(unlockedIds));
        return true;
      }
    } catch {}
    return false;
  }

  getTechUpgrades(): TechUpgrade[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TECH_UPGRADES);
      if (saved) {
        const stored: Partial<TechUpgrade>[] = JSON.parse(saved);
        return TECH_UPGRADES.map(u => {
          const match = stored.find(s => s.id === u.id);
          return match ? { ...u, ...match } : u;
        });
      }
    } catch {}
    return TECH_UPGRADES;
  }

  saveTechUpgrades(upgrades: TechUpgrade[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.TECH_UPGRADES, JSON.stringify(upgrades));
    } catch {}
  }

  getDailyBounties(): DailyBounty[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DAILY_BOUNTIES);
      if (saved) {
        const stored: Partial<DailyBounty>[] = JSON.parse(saved);
        return DAILY_BOUNTIES.map(b => {
          const match = stored.find(s => s.id === b.id);
          return match ? { ...b, ...match } : b;
        });
      }
    } catch {}
    return DAILY_BOUNTIES;
  }

  saveDailyBounties(bounties: DailyBounty[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_BOUNTIES, JSON.stringify(bounties));
    } catch {}
  }

  getBestiary(): BestiaryEntry[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BESTIARY);
      if (saved) {
        const stored: Partial<BestiaryEntry>[] = JSON.parse(saved);
        return BESTIARY.map(e => {
          const match = stored.find(s => s.id === e.id);
          return match ? { ...e, ...match } : e;
        });
      }
    } catch {}
    return BESTIARY;
  }

  getAchievements(): Achievement[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (saved) {
        const stored: Partial<Achievement>[] = JSON.parse(saved);
        return ACHIEVEMENTS.map(a => {
          const match = stored.find(s => s.id === a.id);
          return match ? { ...a, ...match } : a;
        });
      }
    } catch {}
    return ACHIEVEMENTS;
  }

  saveAchievements(achievements: Achievement[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch {}
  }

  getSoundSettings(): SoundSettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOUND_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { masterVolume: 0.8, musicVolume: 0.5, sfxVolume: 0.8, muted: false };
  }

  saveSoundSettings(settings: SoundSettings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND_SETTINGS, JSON.stringify(settings));
    } catch {}
  }
}

export const storageService = new StorageService();
