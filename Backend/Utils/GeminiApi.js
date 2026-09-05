import { GoogleGenAI } from "@google/genai";

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const categorizeWithGemini = async (links) => {

if(!links || links.length === 0) return []

  try {
    const numberedURLstring = links
      .map((link, i) => `${i + 1}. ${link.url} — ${link.title}`)
      .join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite", 
      contents: numberedURLstring,        
      config: {
        systemInstruction: `You are a URL tag generator.
          For each URL, reply with ONE lowercase word describing the site.
          No spaces, no punctuation, one word per line, same order as input.`,
        thinkingConfig: { thinkingLevel: "MINIMAL" },
        temperature: 0,
      },
    });

    const tags = response.text
      .split("\n")
      .map((line) => line.trim().toLowerCase().replace(/[^a-z]/g, ""))
      .filter((line) => line.length > 0);

    return links.map((link, i) => ({
      url: link.url,
      customTag: tags[i] || "personal",
    }));
  } catch (error) {
    console.error("Gemini categorization failed:", error.message);
    return links.map((link) => ({ url: link.url, customTag: null }));
  }
};
