import { urldata } from "../MongoDB/Models/Urlschema.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { ApiError } from "../Utils/ApiError.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { parse } from "node-html-parser";
import { categorizeWithGemini } from "../Utils/GeminiApi.js";

export const URL_CATEGORY_MAP = [
  {
    // Gaming — mods, wikis, game stores, gaming news
    patterns: [
      "nexusmods.com", "moddb.com", "curseforge.com", "modrinth.com",
      "store.steampowered.com", "gog.com", "epicgames.com", "g2a.com",
      "ign.com", "pcgamer.com", "gamesradar.com", "kotaku.com", "gamespot.com",
      "skyrimmods", "modbooru", "f95zone", "fitgirl", "gogames", "gamesnostalgia",
      "howlongtobeat.com", "backloggd.com", "rawg.io", "isthereanydealdeal.com",
    ],
    category: "gaming",
  },
  {
    // Anime — streaming, manga, visual novels
    patterns: [
      "aniwatch", "animekai", "crunchyroll.com", "funimation.com",
      "myanimelist.net", "anilist.co", "mangadex.org", "mangakakalot",
      "animefrenzy", "9anime", "zoro.to", "gogoanime",
      "vndb.org", "novelupdates.com",
    ],
    category: "anime",
  },
  {
    // Documentation — official API and SDK docs
    patterns: [
      "docs.", "/docs/", "/documentation/", "/api/", "/reference/",
      "jwt.io", "mongoosejs.com", "expressjs.com/en",
      "nodejs.org/en/docs", "nodejs.org/api",
      "vitejs.dev", "tailwindcss.com/docs",
      "reactrouter.com", "react.dev",
      "developer.mozilla.org", "web.dev",
      "swagger.io", "postman.com/docs",
      "firebase.google.com/docs", "cloud.google.com/docs",
      "aws.amazon.com/documentation",
    ],
    category: "documentation",
  },
  {
    // Coding — developer platforms, repos, package registries
    patterns: [
      "github.com", "gitlab.com", "bitbucket.org",
      "stackoverflow.com", "stackexchange.com",
      "npmjs.com", "pypi.org", "packagist.org", "crates.io",
      "codepen.io", "codesandbox.io", "replit.com", "jsfiddle.net",
      "leetcode.com", "hackerrank.com", "codeforces.com",
      "dev.to", "hashnode.dev", "medium.com/@",
    ],
    category: "coding",
  },
  {
    // Tutorial / Learning
    patterns: [
      "udemy.com", "coursera.org", "edx.org", "pluralsight.com",
      "freecodecamp.org", "theodinproject.com", "codecombat.com",
      "w3schools.com", "w3resource.com", "geeksforgeeks.org",
      "datacamp.com", "simplilearn.com", "skillshare.com",
      "lynda.com", "linkedin.com/learning",
    ],
    category: "tutorial",
  },
  {
    // Tools — productivity, dev tools, SaaS
    patterns: [
      "notion.so", "obsidian.md", "roamresearch.com",
      "figma.com", "canva.com", "sketch.com",
      "postman.com", "insomnia.rest",
      "trello.com", "linear.app", "jira.atlassian.com",
      "vercel.com", "netlify.com", "render.com",
      "cloudflare.com", "railway.app",
      "excalidraw.com", "whimsical.com", "miro.com",
    ],
    category: "tools",
  },
  {
    // Video
    patterns: [
      "youtube.com", "youtu.be", "twitch.tv",
      "vimeo.com", "dailymotion.com",
      "vegamovies", "moviesmod", "cineb", "soap2day",
    ],
    category: "video",
  },
  {
    // Entertainment — streaming services, movies, TV
    patterns: [
      "netflix.com", "primevideo.com", "hotstar.com",
      "hbomax.com", "disneyplus.com", "apple.tv",
      "imdb.com", "letterboxd.com", "rottentomatoes.com",
      "9to5mac.com", "theverge.com",
    ],
    category: "entertainment",
  },
  {
    // Social
    patterns: [
      "reddit.com", "twitter.com", "x.com", "threads.net",
      "linkedin.com", "facebook.com", "instagram.com",
      "discord.com", "discord.gg", "telegram.org",
      "mastodon", "bluesky.app",
    ],
    category: "social",
  },
  {
    // News
    patterns: [
      "bbc.com", "cnn.com", "reuters.com", "apnews.com",
      "techcrunch.com", "theverge.com", "wired.com",
      "news.ycombinator.com", "hackernews",
      "ndtv.com", "timesofindia", "hindustantimes.com",
    ],
    category: "news",
  },
  {
    // Finance
    patterns: [
      "tradingview.com", "investing.com", "bloomberg.com",
      "coinmarketcap.com", "coingecko.com", "binance.com",
      "zerodha.com", "groww.in", "etmoney.com",
      "moneycontrol.com", "economictimes",
    ],
    category: "finance",
  },
  {
    // Shopping
    patterns: [
      "amazon.com", "amazon.in", "flipkart.com",
      "ebay.com", "etsy.com", "aliexpress.com",
      "myntra.com", "meesho.com", "nykaa.com",
      "shopify.com",
    ],
    category: "shopping",
  },
  {
    // Music
    patterns: [
      "spotify.com", "soundcloud.com", "music.apple.com",
      "genius.com", "last.fm", "bandcamp.com",
      "gaana.com", "jiosaavn.com",
    ],
    category: "music",
  },
  {
    // Health
    patterns: [
      "webmd.com", "healthline.com", "mayoclinic.org",
      "myfitnesspal.com", "nike.com/ntc",
      "practo.com", "1mg.com",
    ],
    category: "health",
  },
  {
    // Sports
    patterns: [
      "espn.com", "cricbuzz.com", "espncricinfo.com",
      "sofascore.com", "bbc.com/sport", "goal.com",
      "nba.com", "icc-cricket.com",
    ],
    category: "sports",
  },
  {
    // Design
    patterns: [
      "dribbble.com", "behance.net", "awwwards.com",
      "css-tricks.com", "smashingmagazine.com",
      "ui8.net", "mobbin.com", "land-book.com",
    ],
    category: "design",
  },
];

const Givecatbygemini = (url, title) => {
  // Step 1 — lowercase the URL for case-insensitive matching
  const lowerUrl = url.toLowerCase();

  // Step 2 — loop through URL_CATEGORY_MAP
  for (const entry of URL_CATEGORY_MAP) {
    // Step 3 — check if any pattern matches the URL
    const matched = entry.patterns.some((pattern) => lowerUrl.includes(pattern));

    // Step 4 — match found → return immediately, no Gemini needed
    if (matched) {
      return { url, title, category: entry.category, confidence: "high" };
    }
  }

  // Step 5 — no match found → flag for Gemini batch
  return { url, title, category: null, confidence: "low" };
};

const bulkInsert = async (normalizedLinks) => {
  try {
    const result = await urldata.insertMany(normalizedLinks, { ordered: false });
    return { inserted: result.length, skipped: 0 };
  } catch (err) {
    const inserted = err.insertedDocs?.length || 0;
    const skipped = normalizedLinks.length - inserted;
    return { inserted, skipped };
  }
};

export const chromePreview = AsyncHandler(async (req, res) => {
  // 1. check file exists
  if (!req.file) throw new ApiError(400, "No file uploaded");

  // 2. convert buffer to string
  const htmlString = req.file.buffer.toString("utf-8");

  // 3. parse HTML and extract links
  const root = parse(htmlString);
  const anchors = root.querySelectorAll("a");

  const rawLinks = anchors
    .map((a) => ({
      url: a.getAttribute("href"),
      title: a.text.trim(),
      addDate: a.getAttribute("add_date"),
    }))
    .filter((link) => link.url?.startsWith("http"));

  // 4. categorize each link against URL_CATEGORY_MAP
  const categorized = rawLinks.map((link) => Givecatbygemini(link.url, link.title));

  // 5. split into two buckets
  const highConfidence = categorized.filter((link) => link.confidence === "high");
  const needsGemini = categorized.filter((link) => link.confidence === "low");

  // 6. batch call Gemini for unmatched links
  let geminiResults = [];
  if (needsGemini.length > 0) {
    geminiResults = await categorizeWithGemini(needsGemini);
  }

  // 7. merge results back using a lookup map
  const geminiMap = {};
  geminiResults.forEach((result) => {
    geminiMap[result.url] = result.customTag;
  });

  const preview = [
    ...highConfidence,
    ...needsGemini.map((link) => ({
      ...link,
      category: geminiMap[link.url] || "Personal",
      confidence: geminiMap[link.url] ? "medium" : "low",
    })),
  ];

  // 8. return preview — no DB write
  res.status(200).json(
    new ApiResponse(
      200,
      {
        total: preview.length,
        preview,
      },
      "Preview ready",
    ),
  );
});

export const chromeConfirm = AsyncHandler(async (req, res) => {
  // 1. get links from req.body — throw if missing or empty
  const { links } = req.body;
  if (!links || links.length === 0) {
    throw new ApiError(400, "No links provided to import");
  }

  // 2. get userId from VerifyJWT middleware
  const userId = req.user._id;

  // 3. normalize each preview link into full urldata document shape
  const normalizedLinks = links.map((link) => ({
    userId,
    Linkdata: link.url,
    title: link.title,
    CategoriesbyDef: link.category || "Personal",
    customTagId: null,
    platform: "chrome",
    mediaType: "link",
    importedAt: new Date(),
    confidence: link.confidence,
  }));

  // 4. bulk insert — handles duplicates silently via ordered:false
  const { inserted, skipped } = await bulkInsert(normalizedLinks);

  // 5. return counts
  res.status(200).json(
    new ApiResponse(
      200,
      {
        inserted,
        skipped,
      },
      "Import complete",
    ),
  );
});
