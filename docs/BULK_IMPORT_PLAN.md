# Bulk Import Feature Plan — BMS App

## Overview

Allow users to import hundreds or thousands of bookmarks from external platforms
into BMS in one operation, with automatic categorization using hashtags and metadata.

Priority platforms (in order):
1. YouTube (liked videos + playlists) — via OAuth
2. Chrome bookmarks — via HTML file upload
3. Google saved links — via OAuth (future)

---

## Architecture: Three-Layer System

```
Layer 1: Data Fetching     → get raw data from platform
Layer 2: Normalization     → convert to standard BMS format
Layer 3: Bulk Insert       → save to MongoDB in one operation
```

Every platform feeds into the same normalization layer.
Normalized data feeds into the same bulk insert logic.
No platform-specific code touches the database.

---

## Standard Normalized Bookmark Object

Every imported item becomes this before saving:

```js
{
  userId:       ObjectId,           // from req.user._id
  Linkdata:     String,             // the actual URL
  title:        String | null,      // video/page title
  platform:     String,             // 'youtube' | 'chrome' | 'manual'
  mediaType:    String,             // 'video' | 'article' | 'link' | 'playlist'
  sourceId:     String | null,      // platform's own ID (for deduplication)
  hashtags:     [String],           // extracted from description/tags
  thumbnail:    String | null,      // thumbnail URL if available
  CategoriesbyDef: String,          // auto-detected or user-selected
  customTagId:  ObjectId | null,    // custom tag if applicable
  importedAt:   Date,               // timestamp of import
  confidence:   String,             // 'high' | 'medium' | 'low' (categorization confidence)
}
```

---

## Platform 1: YouTube Import

### What the API Returns Per Video

```js
{
  id: "dQw4w9WgXcQ",
  snippet: {
    title: "React Tutorial for Beginners",
    description: "Full tutorial...\n\n#react #javascript #webdev",
    tags: ["react", "javascript", "tutorial", "beginners"],
    categoryId: "27",        // 27 = Education
    thumbnails: { default: { url: "..." } },
    channelTitle: "Fireship"
  }
}
```

### YouTube categoryId → BMS Category Mapping

```js
const YOUTUBE_CATEGORY_MAP = {
  // Knowledge
  "27": "Knowledge",   // Education
  "28": "Knowledge",   // Science & Technology
  "26": "Knowledge",   // Howto & Style

  // Entertainment
  "10": "Entertainment", // Music
  "17": "Entertainment", // Sports
  "20": "Entertainment", // Gaming
  "23": "Entertainment", // Comedy
  "24": "Entertainment", // Entertainment
  "25": "Entertainment", // News & Politics
  "1":  "Entertainment", // Film & Animation

  // Personal
  "19": "Personal",    // Travel & Events
  "26": "Personal",    // Howto & Style
  "29": "Personal",    // Nonprofits & Activism
}
```

### Hashtag Extraction Logic

```
Step 1: Extract from description
  "Learn #react and #javascript today #webdev"
  → regex /(?<=#)\w+/g → ["react", "javascript", "webdev"]

Step 2: Merge with tags array
  tags: ["react", "javascript", "tutorial"]
  combined: ["react", "javascript", "webdev", "tutorial"]
  deduplicated: ["react", "javascript", "webdev", "tutorial"]

Step 3: Score against category keyword map
  KEYWORD_MAP = {
    react: "Knowledge", javascript: "Knowledge",
    tutorial: "Knowledge", webdev: "Knowledge",
    music: "Entertainment", gaming: "Entertainment"
  }
  Score → Knowledge: 4, Entertainment: 0
  Confidence: "high" (3+ matches)

Step 4: Assign category + confidence
  CategoriesbyDef: "Knowledge", confidence: "high"
```

### Confidence Thresholds

| Score | Confidence | Action |
|-------|-----------|--------|
| 3+ keyword matches | high | Auto-assign, no review |
| 1-2 matches | medium | Auto-assign, flag for review |
| 0 matches, categoryId exists | low | Use categoryId mapping |
| 0 matches, no categoryId | none | Default "Personal", must review |

Show user only medium/low/none confidence videos for manual review.
For 2500 videos this means reviewing ~200-300, not 2500.

### YouTube Fetch Flow

```
1. Get user's OAuth tokens from OAuthToken collection
2. Check liked videos playlist ID (always "LL" for liked videos)
3. Fetch playlistItems?playlistId=LL&maxResults=50 (paginate with nextPageToken)
4. For each batch, fetch video details: videos?id=id1,id2,...&part=snippet
5. Normalize each video → NormalizedBookmark
6. Send full array to bulk insert endpoint
```

### Handling 2500 Videos

```
Batch 1: fetch 50 liked video IDs (1 unit)
         fetch 50 video details (1 unit)
         normalize 50 videos
Batch 2: repeat...
...
Batch 50: last batch
Total: ~100 units for 2500 videos (well within 10,000/day quota)

insertMany(2500 docs) → 1 MongoDB operation
```

---

## Platform 2: Chrome Bookmarks Import

Chrome exports bookmarks as an HTML file. No OAuth needed.

### How to Export Chrome Bookmarks

```
Chrome → Settings → Bookmarks → Export bookmarks
→ saves "bookmarks_MM_DD_YYYY.html"
```

### HTML Structure

```html
<DT><A HREF="https://example.com" ADD_DATE="1672531200">Example Site</A>
<DT><A HREF="https://github.com" ADD_DATE="1672531200">GitHub</A>
```

### Parsing Logic (Backend)

```js
// Use 'node-html-parser' or regex to extract
const links = html.match(/<A HREF="([^"]+)"[^>]*>([^<]+)<\/A>/gi)
// → [{ url, title, addDate }]
```

### Categorization for Chrome Bookmarks

No tags or categoryId available. Use URL-based heuristics:

```js
const URL_CATEGORY_MAP = {
  "youtube.com":    "Entertainment",
  "github.com":     "Knowledge",
  "stackoverflow":  "Knowledge",
  "netflix.com":    "Entertainment",
  "docs.":          "Knowledge",
  "medium.com":     "Knowledge",
  "instagram.com":  "Instagram",
}
```

Unmatched URLs default to "Personal" with confidence "low".

### Chrome Import UX Flow

```
User goes to /import
Clicks "Import from Chrome"
Sees instructions: "Export your Chrome bookmarks first"
Drag and drop .html file
Backend parses → normalize → preview table
User reviews, confirms
Bulk insert
```

---

## Backend: New Routes

```
POST /api/v1/import/youtube/preview    → fetch from YouTube, return normalized list (no DB write)
POST /api/v1/import/youtube/confirm    → bulk insert confirmed items
POST /api/v1/import/chrome/preview     → parse HTML file, return normalized list
POST /api/v1/import/chrome/confirm     → bulk insert confirmed items
GET  /api/v1/import/history            → list of past import batches
```

Preview endpoints never write to DB — they just fetch and normalize so user can review first.
Confirm endpoints do the actual `insertMany`.

---

## Backend: Bulk Insert Logic

```js
// Use Mongoose insertMany with ordered: false
// ordered: false = continue even if some docs fail (e.g. duplicates)
await urldata.insertMany(normalizedLinks, { ordered: false })

// Deduplication: add unique compound index to urlschema
{ userId: 1, Linkdata: 1 }  // same user can't have same URL twice
// Duplicate key errors are silently ignored with ordered: false
```

---

## Frontend: New Files Needed

```
src/Pages/ImportPage.jsx          → main import hub page
src/components/ChromeImport.jsx   → file dropzone + instructions
src/components/YoutubeImport.jsx  → connect button + status
src/components/ImportPreview.jsx  → paginated table with category override
src/components/ImportProgress.jsx → progress bar during bulk insert
src/api/importApi.js              → all import-related API calls
```

---

## Frontend: Import UX Flow

```
/import page

┌─────────────────────────────────────┐
│  Import Bookmarks                   │
│                                     │
│  [YouTube]  [Chrome]  [More soon]   │
│                                     │
│  YouTube: Connected ✓               │
│  [Import Liked Videos]              │
│  [Import Playlists]                 │
│                                     │
│  Chrome: Upload .html file          │
│  [Drop file here or click to upload]│
└─────────────────────────────────────┘

After fetch:
┌─────────────────────────────────────┐
│  Preview — 2500 items found         │
│  Auto-categorized: 2240 (89%)       │
│  Needs review: 260 (11%)            │
│                                     │
│  [Show only needs review]           │
│                                     │
│  Title         Category   Confidence│
│  React Tut...  Knowledge  ● high    │
│  Lofi Mix      Entertain  ● high    │
│  Unknown vid   Personal   ○ low  ▼  │
│                                     │
│  [Import All]  [Import Selected]    │
└─────────────────────────────────────┘
```

---

## Deduplication

Add compound unique index to `urlschema`:

```js
urlschema.index({ userId: 1, Linkdata: 1 }, { unique: true })
```

If user runs the same import twice:
- `insertMany` with `ordered: false` skips duplicate key errors
- New items get added, duplicates silently ignored
- Return count: `{ inserted: 47, skipped: 2453 }`

---

## Schema Changes to `urlschema.js`

Add these optional fields:

```js
platform:    { type: String, default: "manual", enum: ["manual", "youtube", "chrome"] },
title:       { type: String },
thumbnail:   { type: String },
sourceId:    { type: String },           // YouTube video ID
mediaType:   { type: String, default: "link", enum: ["link", "video", "article", "playlist"] },
hashtags:    [{ type: String }],         // raw extracted hashtags
importedAt:  { type: Date },
confidence:  { type: String, enum: ["high", "medium", "low", "none"] },
```

All fields are optional — existing manual links are unaffected.

---

## Implementation Phases

### Phase 1 — Foundation (do first)
- Add new fields to `urlschema`
- Add compound unique index
- Build normalization utility function
- Build bulk insert endpoint with `insertMany`

### Phase 2 — Chrome Import (easiest, no OAuth)
- File upload endpoint
- HTML parser
- URL-based category heuristics
- Frontend: file dropzone + preview + confirm

### Phase 3 — YouTube Import (requires OAuth)
- Complete OAuth flow (see OAUTH2_PLAN.md first)
- YouTube API fetch logic (paginated)
- Hashtag extraction + category scoring
- Frontend: connect button + preview + confirm

### Phase 4 — Polish
- Import history page
- Progress bar for large imports
- Retry failed imports
- Export your BMS bookmarks back to Chrome HTML format

---

## Dependencies to Install (when ready)

```bash
# Backend
npm install googleapis          # Google/YouTube API client
npm install node-html-parser    # Chrome HTML bookmark parsing
npm install multer              # file upload handling

# Frontend  
npm install react-dropzone      # drag and drop file upload UI
```

---

## Status

⬜ Phase 1 — Not started
⬜ Phase 2 — Not started  
⬜ Phase 3 — Not started
⬜ Phase 4 — Not started

**Start after core app (login, dashboard, CRUD) is complete.**
