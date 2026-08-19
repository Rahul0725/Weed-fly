/**
 * TOPOLOGICA: Storage & Player Progression Persistence Service
 */

import { PlayerStats, SoundSettings, SandboxParameters, BestiaryEntry } from '../game/types';
import { BESTIARY_DATA } from '../game/SectorsData';

const STATS_KEY = 'topologica_player_stats_v1';
const SETTINGS_KEY = 'topologica_sound_settings_v1';
const BESTIARY_KEY = 'topologica_bestiary_v1';
const SANDBOX_KEY = 'topologica_sandbox_params_v1';

export class StorageService {
  public getPlayerStats(): PlayerStats {
    try {
      const data = localStorage.getItem(STATS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Could not read player stats from localStorage', e);
    }

    return {
      chromaFlux: 150,
      totalScore: 0,
      highScore: 0,
      totalStabilizations: 0,
      highestCombo: 0,
      sectorsCompleted: [1],
      unlockedUpgrades: {},
      unlockedBestiary: ['gyroid_hydra'],
      totalPlaytimeSeconds: 0
    };
  }

  public savePlayerStats(stats: PlayerStats) {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (e) {
      console.warn('Could not save player stats to localStorage', e);
    }
  }

  public getSoundSettings(): SoundSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Could not read sound settings', e);
    }

    return {
      masterVolume: 0.8,
      musicVolume: 0.7,
      sfxVolume: 0.9,
      binauralDrone: true,
      microtonalReverb: true
    };
  }

  public saveSoundSettings(settings: SoundSettings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Could not save sound settings', e);
    }
  }

  public getBestiary(): BestiaryEntry[] {
    try {
      const data = localStorage.getItem(BESTIARY_KEY);
      if (data) {
        const parsed = JSON.parse(data) as BestiaryEntry[];
        // Merge with full bestiary definitions
        return BESTIARY_DATA.map(entry => {
          const found = parsed.find(p => p.species === entry.species);
          return found ? { ...entry, encounteredCount: found.encounteredCount, stabilizedCount: found.stabilizedCount } : entry;
        });
      }
    } catch (e) {
      console.warn('Could not read bestiary', e);
    }

    return [...BESTIARY_DATA];
  }

  public saveBestiary(bestiary: BestiaryEntry[]) {
    try {
      localStorage.setItem(BESTIARY_KEY, JSON.stringify(bestiary));
    } catch (e) {
      console.warn('Could not save bestiary', e);
    }
  }

  public getSandboxParams(): SandboxParameters {
    try {
      const data = localStorage.getItem(SANDBOX_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Could not read sandbox params', e);
    }

    return {
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
    };
  }

  public saveSandboxParams(params: SandboxParameters) {
    try {
      localStorage.setItem(SANDBOX_KEY, JSON.stringify(params));
    } catch (e) {
      console.warn('Could not save sandbox params', e);
    }
  }
}

export const storageService = new StorageService();
