/**
 * TOPOLOGICA: Gemini AI 4D Cosmic Oracle & Prophecy Engine
 */

import { GoogleGenAI } from '@google/genai';
import { HarmonicRatioLock, SectorConfig } from '../game/types';

export interface OracleProphecy {
  prophecy: string;
  harmonicInsight: string;
  boonName: string;
  boonDescription: string;
  boonMultiplier: number;
}

const apiKey = process.env.API_KEY || (typeof window !== 'undefined' && (window as any).GEMINI_API_KEY) || '';
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey.trim().length > 0) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (e) {
    console.warn('Could not initialize GoogleGenAI', e);
  }
}

export class GeminiOracleService {
  private fallbackProphecies(
    sector: SectorConfig,
    score: number,
    lock: HarmonicRatioLock,
    stabilizations: number
  ): OracleProphecy {
    const defaultBoon = {
      boonName: 'Hopf Harmonic Resonance Blessing',
      boonDescription: 'Increases constructive resonance collapse window by +25%.',
      boonMultiplier: 1.25
    };

    if (score === 0) {
      return {
        prophecy: 'The 4th dimension whispers in silent symmetry. Calibrate your spatial curvature α and seek the 3:2 fifth harmonic lock.',
        harmonicInsight: 'The vacuum energy is quiescent. Rotate γ to align with the Clifford tori.',
        ...defaultBoon
      };
    }

    if (lock.type === 'GOLDEN_PHI') {
      return {
        prophecy: 'The Golden Spiral (1.618) blooms across the Calabi-Yau manifold. You are weaving the fabric of the cosmos.',
        harmonicInsight: 'Self-similarity observed across all 4 spatial axes. Constructive collapse yield maximized.',
        boonName: 'Phi Golden Transcendence',
        boonDescription: 'Chroma-Flux siphon yield boosted by +50%.',
        boonMultiplier: 1.5
      };
    }

    if (stabilizations > 10) {
      return {
        prophecy: `Ten singularities have surrendered their entropy. The ${sector.name} stabilizes under your harmonic will.`,
        harmonicInsight: 'Wave-function tensor coherence has exceeded 94.2%.',
        boonName: 'Singularity Weaver Mastery',
        boonDescription: 'Entropy accumulation rate dampened by -30%.',
        boonMultiplier: 1.3
      };
    }

    return {
      prophecy: `Spacetime echoes through the ${sector.subtitle}. The harmonic frequencies resonate at ${lock.name}.`,
      harmonicInsight: 'Tension lines across 4D conduits are maintaining structural equilibrium.',
      ...defaultBoon
    };
  }

  public async consultOracle(
    sector: SectorConfig,
    score: number,
    lock: HarmonicRatioLock,
    stabilizations: number,
    entropy: number
  ): Promise<OracleProphecy> {
    const fallback = this.fallbackProphecies(sector, score, lock, stabilizations);

    if (!ai) {
      return fallback;
    }

    try {
      const prompt = `
        You are the Trans-Dimensional Cosmic Oracle of the 4D Non-Euclidean Universe in the game TOPOLOGICA.
        The player is currently resonating inside "${sector.name}" (${sector.subtitle}).
        Player Stats:
        - Current Score: ${score}
        - Current Harmonic Resonance Lock: ${lock.name} (Precision: ${(lock.precision * 100).toFixed(1)}%)
        - Singularities Stabilized: ${stabilizations}
        - Global Manifold Entropy: ${entropy.toFixed(1)}%

        Generate a JSON response with:
        1. "prophecy": A deep, poetic, mystical cosmic revelation (1-2 sentences).
        2. "harmonicInsight": A profound mathematical/topological observation about the 4D manifold (1 sentence).
        3. "boonName": A cool cosmic blessing name.
        4. "boonDescription": A short blessing description.

        Output ONLY valid JSON.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          maxOutputTokens: 200,
          temperature: 0.9,
          thinkingConfig: { thinkingBudget: 0 }
        }
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        prophecy: parsed.prophecy || fallback.prophecy,
        harmonicInsight: parsed.harmonicInsight || fallback.harmonicInsight,
        boonName: parsed.boonName || fallback.boonName,
        boonDescription: parsed.boonDescription || fallback.boonDescription,
        boonMultiplier: 1.3
      };
    } catch (e) {
      return fallback;
    }
  }
}

export const geminiOracleService = new GeminiOracleService();
