import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const categorizeWithGemini = async (links) => {
    try {
 const numberedURLstring = links
  .map((link, i) => `${i + 1}. ${link.url} — ${link.title}`)
  .join("\n")
  const interaction = await ai.interactions.create({
        model: "gemini-3.7-flash",
        system_instruction: `You are a URL tag generator.
          For each URL, reply with ONE lowercase word describing the site.
          No spaces, no punctuation, one word per line, same order as input.`,
        input: numberedURLstring,
        generation_config:{
            thinking_level:"low",
            temperature: 0
        }
        })
const tags = interaction.output_text.split("\n")
.map(line => line.trim().toLowerCase().replace(/[^a-z]/g, ""))
.filter(line => line.length > 0)


return links.map((link,i) => ({
    url: link.url,
    customTag: tags[i] || "Personal"

        }
    )) 
        
    } catch (error) {
        console.log("Error Gemini is not responding")
        return links.map(link => ({ url: link.url, customTag: null }))
     }
}