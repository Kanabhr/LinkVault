import { urldata } from "../MongoDB/Models/Urlschema.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { ApiError } from "../Utils/ApiError.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { parse } from 'node-html-parser';
import { categorizeWithGemini } from "../Utils/GeminiApi.js";
// ─── STEP 1: URL_CATEGORY_MAP ────────────────────────────────────────────────
// First layer of hybrid categorization — instant, no API call needed
// Define an array where each entry has:
//   patterns: array of domain substrings to match against the URL
//   cat: the BMS category to assign if any pattern matches
// Keep patterns lowercase — URL will be lowercased before matching
// Cover major global sites across all categories:
//   Entertainment: streaming, gaming, anime, movies, social media
//   Knowledge: dev docs, courses, coding platforms, research
//   Instagram: instagram.com only
// Everything else falls through to Gemini (Step 2)

// const URL_CATEGORY_MAP = [...]

export const URL_CATEGORY_MAP = [{
    patterns: ["youtube.com", "twitch.tv", "netflix.com", "aniwatch", "animekai",
               "nexusmods.com", "skyrimmods", "modbooru", "f95zone", "soap2day",
               "vegamovies", "moviesmod", "cineb", "fitgirl", "gogames",
               "gamesnostalgia", "pcquest.com", "gamesradar"],
    category:"Entertainment"
},{
    patterns: ["github.com", "stackoverflow.com", "w3schools.com", "mdn",
               "udemy.com", "datacamp.com", "simplilearn.com", "geeksforgeeks",
               "codedamn.com", "w3resource.com", "mongodb.com", "dev.to",
               "hashnode.dev", "medium.com", "freecodecamp", "theodinproject",
               "codecombat", "unity.com", "vercel.com", "nextjs.org"],
    category: "Knowledge"
},
{
    patterns:["instagram.com"],
    category:"Instagram"
}
]

// ─── STEP 2: categorizeWithGemini(url, title) ────────────────────────────────
// Second layer — only called when URL_CATEGORY_MAP has no match
// Called with array of { url, title } objects that had no pattern match
// Build a single prompt containing all unmatched URLs + titles
// Ask Gemini to categorize each one into: Personal, Entertainment, Knowledge, Instagram
// Use gemini-1.5-flash model (free tier: 1500 requests/day)
// Parse Gemini's response — expect one category per line matching input order
// Return array of { url, category, confidence: "medium" }
// On Gemini API error → fallback to "Personal" with confidence "low"
// Install: npm install @google/generative-ai
// API key stored in Backend/.env as GEMINI_API_KEY



// const Givecatbygemini = AsyncHandler(async (url , title) => {
//     if()
// })



// ─── STEP 3: categorizeUrl(url, title) ──────────────────────────────────────
// Main categorization entry point — implements the hybrid flow:
//
//   URL comes in
//       ↓
//   Lowercase the URL
//   Loop through URL_CATEGORY_MAP
//   Check if any pattern in entry.patterns is found in the URL
//       ↓
//   Match found → return { category: entry.cat, confidence: "high" }
//   (no API call, instant)
//       ↓
//   No match → return { category: null, confidence: "low" }
//   (will be sent to Gemini in batch by chromePreview)
//
// This function is called per URL during HTML parsing
// It never calls Gemini directly — Gemini is batched separately


// ─── STEP 4: bulkInsert(normalizedLinks) ────────────────────────────────────
// Takes array of fully normalized bookmark objects
// Calls urldata.insertMany(normalizedLinks, { ordered: false })
// ordered: false → if one URL is duplicate, rest still insert — never abort batch
// On success → return { inserted: result.length, skipped: 0 }
// On error (BulkWriteError from duplicates):
//   inserted = err.insertedDocs?.length || 0
//   skipped  = normalizedLinks.length - inserted
//   return { inserted, skipped }
// Never throws — always returns counts so controller can respond cleanly


// ─── STEP 5: chromePreview ──────────────────────────────────────────────────
// Route: POST /api/v1/import/chrome/preview
// Middleware: multer single upload (no VerifyJWT — no DB write here)
// Purpose: parse HTML file, categorize all URLs, return preview — no DB write
//
// Flow:
//   1. Get req.file — throw ApiError 400 if missing
//   2. Convert req.file.buffer to string: buffer.toString("utf-8")
//   3. Parse HTML string with node-html-parser → parse(htmlString)
//   4. Select all <a> tags: root.querySelectorAll("a")
//   5. For each <a> tag extract:
//        href  = a.getAttribute("href")
//        title = a.text.trim()
//        addDate = a.getAttribute("add_date")
//   6. Filter out non-http links (removes chrome://, about:, javascript: etc)
//   7. For each valid URL call categorizeUrl(url, title)
//   8. Separate results into two buckets:
//        highConfidence → already has category (matched URL_CATEGORY_MAP)
//        needsGemini   → confidence "low", category null
//   9. If needsGemini.length > 0 → call categorizeWithGemini(needsGemini)
//        merge Gemini results back into the full list
//  10. Build preview object for each link:
//        { url, title, category, confidence, addDate }
//        NO userId here — this is a preview, no auth, no DB
//  11. Return res 200 with:
//        { total: links.length, preview: [...] }


// ─── STEP 6: chromeConfirm ──────────────────────────────────────────────────
// Route: POST /api/v1/import/chrome/confirm
// Middleware: VerifyJWT (user must be logged in to write to DB)
// Purpose: take confirmed preview items, normalize fully, bulk insert to MongoDB
//
// Flow:
//   1. Get links array from req.body
//      throw ApiError 400 if empty or missing
//   2. Get userId from req.user._id (set by VerifyJWT)
//   3. Map each preview object into full normalized bookmark:
//        {
//          userId,
//          Linkdata:        link.url,
//          title:           link.title,
//          CategoriesbyDef: link.category,
//          customTagId:     null,       ← bulk imports never create CustomTag docs
//          platform:        "chrome",
//          mediaType:       "link",
//          importedAt:      new Date(),
//          confidence:      link.confidence,
//        }
//   4. Call bulkInsert(normalizedLinks)
//   5. Return res 200 with:
//        { inserted, skipped, message: "Import complete" }
