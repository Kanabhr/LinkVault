# Bulk Import Feature Plan — BMS App

## Overview

Allow users to import hundreds or thousands of bookmarks from external platforms
into BMS in one operation, with automatic categorization using hashtags and metadata.

Priority platforms (revised order — easiest first):
1. Chrome bookmarks — via HTML file upload (no OAuth, start here)
2. YouTube (liked videos + playlists) — via OAuth
3. Google saved links — via OAuth (future)

---

## Architecture: Three-Layer System

```
Layer 1: Data Fetching     → get raw data from platform
Layer 2: Normalization     → convert to standard BMS format
Layer 3: Bulk Insert       → save to MongoDB in one operation
```

Every platform feeds into the same normalization layer.
Normalized data feeds into the same bulk insert.
No platform-specific code touches the database directly.

---

## Current Schema State (already in `urlschema.js`)

```js
// Already implemented:
userId          ✅
Linkdata        ✅
CategoriesbyDef ✅ (with null in enum)
customTagId     ✅
compound index  ✅ { userId: 1, Linkdata: 1 }
```

## Schema Fields to Add (when starting Phase 1)

```js
// Add to urlschema — all optional, existing links unaffected
platform:    { type: String, default: "manual", enum: ["manual", "youtube", "chrome"] },
title:       { type: String, default: null },
thumbnail:   { type: String, default: null },
sourceId:    { type: String, default: null },  // YouTube video ID for dedup
mediaType:   { type: String, default: "link", enum: ["link", "video", "article", "playlist"] },
hashtags:    [{ type: String }],
importedAt:  { type: Date, default: null },
confidence:  { type: String, enum: ["high", "medium", "low", "none"], default: null },
```

---

## Standard Normalized Bookmark Object

Every imported item becomes this shape before `insertMany`:

```js
{
  userId:          ObjectId,        // from req.user._id — always set server-side
  Linkdata:        String,          // the actual URL
  title:           String | null,   // video/page title
  platform:        String,          // 'youtube' | 'chrome' | 'manual'
  mediaType:       String,          // 'video' | 'link'
  sourceId:        String | null,   // YouTube video ID (prevents re-import)
  hashtags:        [String],        // extracted tags
  thumbnail:       String | null,
  CategoriesbyDef: String | null,   // auto-detected or user-selected
  customTagId:     null,            // always null for imports — no CustomTag doc created
  importedAt:      Date,
  confidence:      String,          // 'high' | 'medium' | 'low' | 'none'
}
```

⚠️ `customTagId` is always `null` for bulk imports. Custom tags require creating
a `CustomTag` document first — that's a manual operation. Imported links use
`CategoriesbyDef` only.

---

## Bulk Insert Logic

```js
// In import controller — used by both Chrome and YouTube
const bulkInsert = async (normalizedLinks) => {
  try {
    const result = await urldata.insertMany(normalizedLinks, { ordered: false })
    return { inserted: result.length, skipped: normalizedLinks.length - result.length }
  } catch (err) {
    // ordered: false means duplicates throw but others still insert
    // err.insertedDocs contains successfully inserted items
    const inserted = err.insertedDocs?.length || 0
    const skipped = normalizedLinks.length - inserted
    return { inserted, skipped }
  }
}
```

`ordered: false` is critical — without it, one duplicate stops the entire batch.

---

## Platform 1: Chrome Bookmarks Import (Start Here — No OAuth)

### Why First
- Zero external dependencies
- No API keys needed
- Builds confidence before OAuth complexity
- Immediate value for users

### How to Export Chrome Bookmarks

```
Chrome → Settings (⋮) → Bookmarks → Bookmark manager → ⋮ → Export bookmarks
→ saves "bookmarks_MM_DD_YYYY.html"
```

### Chrome HTML Structure

```html
<DT><A HREF="https://example.com" ADD_DATE="1672531200">Example Site</A>
<DT><A HREF="https://github.com" ADD_DATE="1672531200">GitHub</A>
```

### Parsing Logic

```js
// node-html-parser approach (more reliable than regex)
import { parse } from 'node-html-parser'

const root = parse(htmlString)
const anchors = root.querySelectorAll('a')
const links = anchors.map(a => ({
  url: a.getAttribute('href'),
  title: a.text,
  addDate: a.getAttribute('add_date')
})).filter(l => l.url?.startsWith('http'))  // remove chrome:// and other non-http links
```

### URL-based Categorization

```js
const URL_CATEGORY_MAP = [
  { match: ["youtube.com", "twitch.tv", "netflix.com", "spotify.com"], cat: "Entertainment" },
  { match: ["github.com", "stackoverflow.com", "docs.", "developer.", "medium.com", "dev.to"], cat: "Knowledge" },
  { match: ["instagram.com"], cat: "Instagram" },
]

function categorizeByUrl(url) {
  for (const rule of URL_CATEGORY_MAP) {
    if (rule.match.some(pattern => url.includes(pattern))) {
      return { category: rule.cat, confidence: "medium" }
    }
  }
  return { category: "Personal", confidence: "low" }
}
```

---

## Platform 2: YouTube Import (Requires OAuth First)

### Prerequisites
- Complete OAUTH2_PLAN.md implementation
- `getValidToken(userId)` utility working

### What the API Returns Per Video

```js
// GET https://www.googleapis.com/youtube/v3/videos?part=snippet&id=videoId1,videoId2
{
  id: "dQw4w9WgXcQ",
  snippet: {
    title: "React Tutorial for Beginners",
    description: "Full tutorial...\n\n#react #javascript #webdev",
    tags: ["react", "javascript", "tutorial"],   // may be empty for some videos
    categoryId: "27",
    thumbnails: { default: { url: "https://..." } },
    channelTitle: "Fireship"
  }
}
```

### YouTube categoryId → BMS Category Mapping

```js
const YOUTUBE_CATEGORY_MAP = {
  "27": "Knowledge",     // Education
  "28": "Knowledge",     // Science & Technology
  "10": "Entertainment", // Music
  "17": "Entertainment", // Sports
  "20": "Entertainment", // Gaming
  "23": "Entertainment", // Comedy
  "24": "Entertainment", // Entertainment
  "1":  "Entertainment", // Film & Animation
  "19": "Personal",      // Travel & Events
  "22": "Personal",      // People & Blogs
}
// ⚠️ Removed duplicate key "26" (was listed twice in original doc)
// "26" = Howto & Style → maps to "Knowledge"
const YOUTUBE_CATEGORY_MAP_EXTRA = { "26": "Knowledge" }
```

### Hashtag Extraction + Scoring

```js
// Step 1: Extract hashtags from description
const extractHashtags = (description) =>
  [...description.matchAll(/#(\w+)/g)].map(m => m[1].toLowerCase())

// Step 2: Merge with tags array
const allTags = [...new Set([...extractHashtags(description), ...tags.map(t => t.toLowerCase())])]

// Step 3: Score against keyword map
const KEYWORD_CATEGORY_MAP = {
  Knowledge:     ["react", "javascript", "python", "tutorial", "course", "learn", "code", "programming", "webdev", "dev", "software", "ai", "tech"],
  Entertainment: ["music", "gaming", "game", "funny", "comedy", "vlog", "entertainment", "movie", "film", "sport"],
  Personal:      ["travel", "food", "fitness", "health", "lifestyle", "family", "cooking"],
  Instagram:     ["instagram", "reels", "shorts"],
}

function scoreCategory(tags) {
  const scores = { Knowledge: 0, Entertainment: 0, Personal: 0, Instagram: 0 }
  for (const tag of tags) {
    for (const [cat, keywords] of Object.entries(KEYWORD_CATEGORY_MAP)) {
      if (keywords.includes(tag)) scores[cat]++
    }
  }
  const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]
  const confidence = top[1] >= 3 ? "high" : top[1] >= 1 ? "medium" : "low"
  return { category: top[1] > 0 ? top[0] : null, confidence }
}
```

### YouTube Fetch Flow

```
1. getValidToken(userId) — refresh if expired
2. Call playlistItems?playlistId=LL&maxResults=50 (LL = Liked Videos)
3. Collect all video IDs across pages using nextPageToken
4. Batch video IDs into groups of 50
5. For each batch: GET videos?id=id1,id2,...&part=snippet
6. Normalize each video → NormalizedBookmark
7. Return full normalized array to preview endpoint (no DB write yet)
```

### Quota Reality Check

| Operation | Cost | For 2500 videos |
|-----------|------|-----------------|
| `playlistItems.list` (50/page) | 1 unit | 50 units |
| `videos.list` (50/batch) | 1 unit | 50 units |
| **Total** | | **~100 units** |

Default quota: 10,000 units/day — 2500 videos costs 1% of daily quota.

---

## Backend: New Routes

Register under `/api/v1/import` in `app.js`:

```js
import importRouter from "./Routes/import.routes.js"
app.use("/api/v1/import", importRouter)
```

Routes:
```
POST /api/v1/import/chrome/preview     → multer + parse HTML → return normalized list
POST /api/v1/import/chrome/confirm     → VerifyJWT + bulkInsert confirmed items
POST /api/v1/import/youtube/preview    → VerifyJWT + fetch YouTube → return normalized list
POST /api/v1/import/youtube/confirm    → VerifyJWT + bulkInsert confirmed items
GET  /api/v1/import/history            → VerifyJWT + return past import summaries
```

⚠️ `chrome/preview` does NOT need `VerifyJWT` for parsing — but `chrome/confirm`
does because it writes to DB with `req.user._id`.

---

## Frontend: New Files

```
src/Pages/ImportPage.jsx          → main import hub, route: /import
src/components/ChromeImport.jsx   → file dropzone + instructions
src/components/YoutubeImport.jsx  → connect status + import buttons
src/components/ImportPreview.jsx  → paginated table (50/page) with category override
src/components/ImportProgress.jsx → "Importing X of Y..." progress indicator
src/api/importApi.js              → chrome preview, chrome confirm, youtube preview, youtube confirm
src/api/oauthApi.js               → getYoutubeStatus, connectYoutube, revokeYoutube
```

Add to `App.jsx`:
```jsx
<Route element={<ProtectedRoute />}>
  <Route path="/import" element={<ImportPage />} />
</Route>
```

---

## Frontend: ImportPreview Table

The preview table must be paginated — don't render 2500 rows at once:

```
Show 50 rows per page
"Show only needs review" toggle → filters to confidence low/none/medium
Category dropdown per row → user can override auto-detected category
Select all / deselect all
[Import Selected] → sends only checked items to confirm endpoint
[Import All] → sends everything
```

---

## Dependencies to Install (when ready)

```bash
# Backend
npm install googleapis          # YouTube + Google OAuth
npm install node-html-parser    # Chrome HTML parsing
npm install multer              # file upload middleware

# Frontend
npm install react-dropzone      # drag and drop file UI
```

---

## Implementation Phases (Revised Order)

### Phase 1 — Foundation + Chrome Import
- Add new fields to `urlschema.js`
- Write `bulkInsert` utility function
- Write normalization function
- Install `multer` + `node-html-parser`
- Build `chrome/preview` and `chrome/confirm` routes
- Build `ChromeImport.jsx` + `ImportPreview.jsx` + `ImportPage.jsx`
- Test full Chrome import flow end to end
- **Deliverable: Chrome import working**

### Phase 2 — OAuth + YouTube Import
- Complete OAUTH2_PLAN.md fully
- Write `getValidToken(userId)` utility
- Build YouTube fetch + normalize logic
- Build `youtube/preview` and `youtube/confirm` routes
- Build `YoutubeImport.jsx` component
- Test full YouTube import flow
- **Deliverable: YouTube import working**

### Phase 3 — Polish
- Import history endpoint + UI
- Progress indicator for large imports
- Retry failed imports
- Export BMS bookmarks back to Chrome HTML format
- **Deliverable: Complete import hub**

---

## Status

⬜ Phase 1 — Not started (start here)
⬜ Phase 2 — Not started (requires OAuth2_PLAN.md complete)
⬜ Phase 3 — Not started

**Start Phase 1 after core app styling is complete.**
**Deploy before starting Phase 2 (OAuth requires live redirect URI).**
