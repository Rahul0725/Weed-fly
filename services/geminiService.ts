import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || (typeof window !== 'undefined' && (window as any).GEMINI_API_KEY) || '';
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey.trim().length > 0) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (e) {
    console.warn("Could not initialize GoogleGenAI with provided key", e);
  }
}

export const getGameCommentary = async (score: number): Promise<string> => {
  // Built-in witty announcer commentary fallback
  const fallbackCommentary = (pts: number): string => {
    if (pts === 0) return "Did you even open your eyes before pressing space?";
    if (pts < 5) return "Gravity: 1, Your pilot skills: 0.";
    if (pts < 15) return "Not bad for a rookie, but the crystals remain unbroken.";
    if (pts < 30) return "Impressive flight! The Cyber Leviathan is starting to notice you.";
    if (pts < 60) return "Sensational reflexes! You grazed through the danger like an ace.";
    return "A true celestial sovereign of the skies. Absolute god-tier flying!";
  };

  if (!ai) {
    return fallbackCommentary(score);
  }

  try {
    const prompt = `
      You are a sarcastic, witty, and slightly mean game announcer for a high-speed arcade flight game called Aero Odyssey.
      The player just finished a flight run with a final score of ${score}.

      - If the score is 0-5: Roast them hard. Tell them they are terrible.
      - If the score is 6-20: Give a backhanded compliment.
      - If the score is 21-50: Be impressed but skeptical.
      - If the score is 50+: Praise them as a god of gaming.

      Keep the response short (max 1 sentence) and punchy. Do not include quotes.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        maxOutputTokens: 60,
        temperature: 1.0,
        thinkingConfig: { thinkingBudget: 0 },
      }
    });

    return response.text || fallbackCommentary(score);
  } catch (error) {
    return fallbackCommentary(score);
  }
};