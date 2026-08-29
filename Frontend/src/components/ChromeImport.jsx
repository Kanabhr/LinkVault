// ─── PURPOSE ────────────────────────────────────────────────────────────────
// this component handles step 1: user picks their chrome bookmarks .html file
// and sends it to the backend preview endpoint

// ─── STATE ──────────────────────────────────────────────────────────────────
// file state — holds the File object selected by the user, initially null
// loading state — true while waiting for backend preview response
// error state — holds any error message to show the user

// ─── PROPS ──────────────────────────────────────────────────────────────────
// receives onPreviewReady(previewData) callback from ImportPage
// when preview response comes back, call this with the data
// ImportPage will then show ImportPreview component with that data

// ─── handleFileChange ───────────────────────────────────────────────────────
// fires when user picks a file from the input
// set the file state to e.target.files[0]
// clear any previous error

// ─── handleUpload ────────────────────────────────────────────────────────────
// fires when user clicks the "Preview Bookmarks" button
// if no file selected, set error "Please select a file first" and return
// set loading true
// call chromePreview(file) from importApi.js
// on success: call onPreviewReady with the response data
// on error: set error message from response or fallback message
// finally: set loading false

// ─── RENDER ─────────────────────────────────────────────────────────────────
// show instructions: "Export your bookmarks from Chrome first"
// file input with accept=".html" — only shows html files in picker
// "Preview Bookmarks" button — disabled when loading
// show error message if error state is set
