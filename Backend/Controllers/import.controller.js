// import urldata model from Urlschema.js
// import AsyncHandler from Utils/AsyncHandler.js
// import ApiError from Utils/ApiError.js
// import ApiResponse from Utils/ApiResponse.js
// import parse from node-html-parser package

// ─── URL CATEGORY MAP ───────────────────────────────────────────────────────
// define a URL_CATEGORY_MAP array
// each entry has: array of domain patterns to match + category name
// example entries: youtube.com → Entertainment, github.com → Knowledge
// this is used by categorizeByUrl() below

// ─── categorizeByUrl() ──────────────────────────────────────────────────────
// helper function: takes a url string, returns { category, confidence }
// loop through URL_CATEGORY_MAP
// if any pattern in the match array is found in the url → return that category with confidence "medium"
// if no match found → return category "Personal" with confidence "low"

// ─── bulkInsert() ───────────────────────────────────────────────────────────
// helper function: takes array of normalized link objects
// call urldata.insertMany with ordered: false
// ordered: false means if one duplicate fails, the rest still insert
// on success return { inserted: result.length, skipped: 0 }
// on error (duplicate key errors): 
//   inserted count comes from err.insertedDocs?.length
//   skipped = total - inserted
//   return { inserted, skipped }

// ─── chromePreview ──────────────────────────────────────────────────────────
// wrap in AsyncHandler
// get the uploaded file from req.file
// if no file found throw ApiError 400 "No file uploaded"
// convert req.file.buffer to a string using buffer.toString("utf-8")
// parse the html string using node-html-parser
// select all <a> tags from the parsed html
// for each <a> tag extract: href attribute, inner text as title, add_date attribute
// filter out any links that do not start with "http" (removes chrome:// and other internal links)
// for each valid link run categorizeByUrl() to get category and confidence
// build a normalized preview object for each link:
//   { url, title, category, confidence }
//   do NOT include userId here — no auth, no DB write at this stage
// return res 200 with the array of preview objects and total count

// ─── chromeConfirm ──────────────────────────────────────────────────────────
// wrap in AsyncHandler
// get the array of preview objects from req.body
// if array is empty throw ApiError 400 "No links to import"
// get userId from req.user._id (VerifyJWT already ran on this route)
// map each preview object into a full normalized bookmark object:
//   add userId, platform: "chrome", mediaType: "link", importedAt: new Date()
//   customTagId: null (bulk imports never create custom tags)
// call bulkInsert() with the full normalized array
// return res 200 with { inserted, skipped } counts
