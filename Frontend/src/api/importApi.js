// import axiosService from ./axios

// chromePreview(file)
// takes the raw file object from the file input
// create a new FormData instance
// append the file to FormData with key "bookmarkFile" — must match Multer field name
// post to "/import/preview" with Content-Type multipart/form-data header
// returns the preview array from the backend

// chromeConfirm(previewData)
// takes the preview array returned from chromePreview
// post to "/import/confirm" as plain JSON
// axiosService handles auth token automatically via interceptor
// returns { inserted, skipped } from the backend
