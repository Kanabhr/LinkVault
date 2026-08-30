import multer from "multer";
function fileFilter(req, file, cb) {
  if (file.mimetype === "text/html") {
    cb(null, true);
  } else {
    cb(new Error("Only HTML files are allowed"));
  }
}
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024, files: 1 }, fileFilter: fileFilter });

export const single = upload.single("chromebmimport");
