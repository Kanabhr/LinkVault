// import multer from multer package ?

// configure storage to memoryStorage ?
// reason: we do not want to save the .html file to disk ?
// we only need to read it in memory, parse it, then discard it

// set file filter to only accept .html files
// if user uploads a non .html file, reject it with an error message

// set file size limit to 5mb so server is not overloaded

// export a single upload middleware using upload.single()
// field name should be "bookmarkFile" — this must match what frontend sends in FormData
import multer from "multer";
function fileFilter(req, file, cb) {
  if (file.mimetype === "text/html") {
    cb(null, true);
  } else {
    cb(new Error("Only HTML files are allowed"));
  }  
}
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024, files: 1 } , fileFilter: fileFilter });

export const single = upload.single("chromebmimport");
