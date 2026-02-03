import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGameCommentary = async (score: number): Promise<string> => {
  try {
    const prompt = `
      You are a sarcastic, witty, and slightly mean game announcer for a Flappy Bird clone.
      The player just finished a game with a score of ${score}.

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

    return response.text || "AI is speechless at that performance.";
  } catch (error) {
    console.error("Error fetching AI commentary:", error);
    return "The AI is offline, but I'm judging you silently.";
  }
};