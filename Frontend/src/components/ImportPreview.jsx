// ─── PURPOSE ────────────────────────────────────────────────────────────────
// this component handles step 2: shows the user a summary of what was parsed
// from their chrome bookmarks file before anything is saved to the database

// ─── PROPS ──────────────────────────────────────────────────────────────────
// previewData — array of normalized link objects returned from chromePreview
// onImportDone(result) — callback from ImportPage, called after confirm succeeds
//   result contains { inserted, skipped }

// ─── STATE ──────────────────────────────────────────────────────────────────
// loading state — true while waiting for confirm response
// error state — holds any error message

// ─── DERIVED DATA (no state needed, compute from previewData) ────────────────
// total — previewData.length
// category breakdown — count how many links fall into each category
//   group by category name, count each group
//   example output: { Knowledge: 89, Entertainment: 54, Personal: 71 }

// ─── handleImport ────────────────────────────────────────────────────────────
// fires when user clicks "Import All"
// set loading true
// call chromeConfirm(previewData) from importApi.js
// on success: call onImportDone with { inserted, skipped }
// on error: set error message
// finally: set loading false

// ─── RENDER ─────────────────────────────────────────────────────────────────
// show total bookmarks found: "Found 247 bookmarks"
// show category breakdown as a simple list:
//   Knowledge: 89
//   Entertainment: 54
//   Personal: 71
// "Import All" button — disabled when loading
// show loading text "Importing..." when loading is true
// show error message if error state is set
