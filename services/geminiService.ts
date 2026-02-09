
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function askAssistant(userPrompt: string, history: { role: string, parts: { text: string }[] }[] = []) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: "user", parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });
    
    return response.text || "Извините, я не смог обработать ваш запрос.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Произошла ошибка при связи с ассистентом. Попробуйте позже.";
  }
}
