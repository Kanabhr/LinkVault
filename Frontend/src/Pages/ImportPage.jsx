// ─── PURPOSE ────────────────────────────────────────────────────────────────
// this is the main page for the chrome import feature
// it manages which step the user is on and passes data between components

// ─── STATE ──────────────────────────────────────────────────────────────────
// previewData — null initially, set when chromePreview returns data
//   when null: show ChromeImport component (step 1)
//   when set: show ImportPreview component (step 2)
// importResult — null initially, set when chromeConfirm returns { inserted, skipped }
//   when set: hide ImportPreview and show the final success message

// ─── RENDER ─────────────────────────────────────────────────────────────────
// if importResult is set:
//   show success message: "Import complete — X imported, Y skipped"
//   show a button "Go to Dashboard" that navigates to /dashboard using useNavigate

// else if previewData is set:
//   show ImportPreview component
//   pass previewData as prop
//   pass onImportDone callback that sets importResult state

// else (default — step 1):
//   show ChromeImport component
//   pass onPreviewReady callback that sets previewData state
