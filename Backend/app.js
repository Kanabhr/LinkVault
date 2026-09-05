import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./Routes/User.routes.js";
import linkdataRouter from "./Routes/Linkdata.routes.js";
import importRouter from "./Routes/import.routes.js";
const app = express();
app.use(
 cors({
  origin: function(origin, callback) {
    const allowed = process.env.CORS_ORIGIN
    // allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true)
    if (allowed === "*" || allowed === origin) {
      return callback(null, true)
    }
    callback(new Error("Not allowed by CORS"))
  },
  credentials: true,
})

);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.get("/api/v1/health",(_req,res)=> res.status(200).json({status: "OK"}))
// Routes here
app.use("/api/v1/users", userRouter);
app.use("/api/v1/Linkdata", linkdataRouter);
app.use("/api/v1/import/chrome", importRouter);
//middleware error handling
app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
export { app };
