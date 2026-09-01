import { GoogleGenAI } from "@google/genai";

export const categorizeWithGemini = async (links) => {
  // Bug 1 fix: lazy init — client created here, not at module load time
  // so dotenv has already populated process.env before this runs
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  try {
    const numberedURLstring = links
      .map((link, i) => `${i + 1}. ${link.url} — ${link.title}`)
      .join("\n");

    // Bug 2 fix: ai.models.generateContent, not ai.interactions.create
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",          // Bug 3a fix: valid model name
      contents: numberedURLstring,         // Bug 3b fix: 'contents' not 'input'
      config: {
        systemInstruction: `You are a URL tag generator.
For each URL, reply with ONE lowercase word describing the site.
No spaces, no punctuation, one word per line, same order as input.`,
        // Bug 3c fix: systemInstruction inside config, camelCase
        // Bug 3d fix: thinkingConfig inside config, not generation_config
        thinkingConfig: { thinkingLevel: "NONE" },
        temperature: 0,
      },
    });

    // Bug 4 fix: response.text not interaction.output_text
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
