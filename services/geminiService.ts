
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants.tsx";

const getApiKey = () => (window as any).process?.env?.API_KEY || "";

export async function askAssistant(userPrompt: string, history: { role: string, parts: { text: string }[] }[] = []) {
  try {
    const apiKey = getApiKey();
    if (!apiKey) return "API ключ не настроен.";

    const ai = new GoogleGenAI({ apiKey });
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
    
    return response.text || "Ошибка обработки запроса.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Произошла ошибка при связи с ассистентом.";
  }
}
