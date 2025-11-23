import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface WordAnalysis {
  root: string;
  grammar: string;
  depth: string;
  relatedWords: string[];
}

export const analyzeWordWithGemini = async (arabicWord: string, context: string): Promise<WordAnalysis | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the Quranic Arabic word "${arabicWord}" found in the context of "${context}".
      Provide:
      1. The triliteral root.
      2. A brief grammatical explanation (noun/verb, tense, etc).
      3. A spiritual or linguistic depth note (1 sentence).
      4. 2 related Arabic words from the same root.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            root: { type: Type.STRING },
            grammar: { type: Type.STRING },
            depth: { type: Type.STRING },
            relatedWords: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ["root", "grammar", "depth", "relatedWords"]
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as WordAnalysis;
    }
    return null;

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return null;
  }
};