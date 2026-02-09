
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants.tsx";

export async function askAssistant(userPrompt: string, history: any[] = []) {
  try {
    const apiKey = (window as any).process?.env?.API_KEY;
    if (!apiKey) return "Ассистент временно недоступен. Пожалуйста, попробуйте позже.";

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
    
    return response.text || "Извините, я не смог сформировать ответ.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Произошла техническая ошибка при обработке вашего запроса.";
  }
}
