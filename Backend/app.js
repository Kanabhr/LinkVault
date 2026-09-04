import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./Routes/User.routes.js";
import linkdataRouter from "./Routes/Linkdata.routes.js";
import importRouter from "./Routes/import.routes.js";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("public"));
app.use(cookieParser());
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
