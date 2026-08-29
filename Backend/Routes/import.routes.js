// import Router from express
// import VerifyJWT from Auth.middleware.js
// import upload from Multer.middleware.js
// import chromePreview and chromeConfirm from import.controller.js

// create a new Router instance

// POST /preview
// middlewares: upload.single("bookmarkFile")
// no VerifyJWT here — we are only parsing the file, not writing to DB
// handler: chromePreview

// POST /confirm
// middlewares: VerifyJWT
// no multer here — confirm receives a JSON array, not a file
// handler: chromeConfirm

// export default router
