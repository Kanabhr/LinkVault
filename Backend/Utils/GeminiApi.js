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
        systemInstruction: `You are a URL classifier for a bookmark manager application.

For each numbered URL and title below, respond with exactly ONE tag from this allowed list:
gaming, anime, documentation, tutorial, coding, tools, news, social, video, music, shopping, finance, health, travel, food, sports, design, education, forum, entertainment, other

Classification rules:
- gaming: game mods, game wikis, gaming news, esports, game stores (nexusmods, ign, steam, pcgamer)
- anime: anime streaming, manga, visual novels, anime news (aniwatch, crunchyroll, myanimelist)
- documentation: official API docs, SDK references, language specs (jwt.io, docs.mongodb.com, developer.mozilla.org, nodejs.org/api)
- tutorial: step-by-step guides, how-to articles, courses (udemy, coursera, freecodecamp, w3schools)
- coding: developer tools, code repos, programming platforms, package registries (github, stackoverflow, npmjs, codepen)
- tools: productivity apps, utilities, SaaS tools (notion, figma, postman, trello, vercel)
- news: general news, tech news, current events (bbc, techcrunch, hackernews, reuters)
- social: social networks, community platforms (reddit, twitter, linkedin, discord)
- video: video platforms (youtube, twitch, vimeo, dailymotion)
- music: music streaming, lyrics, music discovery (spotify, soundcloud, genius)
- shopping: e-commerce, marketplaces, product reviews (amazon, flipkart, ebay)
- finance: stocks, crypto, banking, personal finance (tradingview, coinmarketcap, zerodha, bloomberg)
- health: medical info, fitness, mental health (webmd, healthline, myfitnesspal)
- travel: flights, hotels, travel guides, maps (booking.com, tripadvisor, google maps)
- food: recipes, restaurant discovery, food delivery (zomato, swiggy, allrecipes)
- sports: sports news, live scores, athletics (espn, cricbuzz, sofascore)
- design: UI/UX, graphics, creative tools (dribbble, behance, figma, canva)
- education: academic content, research, online learning (coursera, khan academy, arxiv)
- forum: discussion boards, Q&A communities (reddit, stackoverflow, quora, discord servers)
- entertainment: movies, TV shows, streaming, general fun content (netflix, imdb, letterboxd)
- other: anything that doesn't clearly fit above

Critical rules:
- Reply with ONLY the tag word, nothing else
- One tag per line
- Same order as input
- No numbers, no punctuation, no explanations
- If unsure between two, pick the more specific one
`,
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
