import { urldata } from "../MongoDB/Models/Urlschema.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { ApiError } from "../Utils/ApiError.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { parse } from "node-html-parser";
import { categorizeWithGemini } from "../Utils/GeminiApi.js";

export const URL_CATEGORY_MAP = [
  {
    patterns: ["youtube.com", "twitch.tv", "netflix.com", "aniwatch", "animekai", "nexusmods.com", "skyrimmods", "modbooru", "f95zone", "soap2day", "vegamovies", "moviesmod", "cineb", "fitgirl", "gogames", "gamesnostalgia", "pcquest.com", "gamesradar"],
    category: "Entertainment",
  },
  {
    patterns: ["github.com", "stackoverflow.com", "w3schools.com", "mdn", "udemy.com", "datacamp.com", "simplilearn.com", "geeksforgeeks", "codedamn.com", "w3resource.com", "mongodb.com", "dev.to", "hashnode.dev", "medium.com", "freecodecamp", "theodinproject", "codecombat", "unity.com", "vercel.com", "nextjs.org"],
    category: "Knowledge",
  },
  {
    patterns: ["instagram.com"],
    category: "Instagram",
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
