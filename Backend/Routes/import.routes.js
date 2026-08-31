import { Router } from "express";
import { single } from "../Middleware/Multer.middleware.js";
import { VerifyJWT } from "../Middleware/Auth.middleware.js";
import { chromeConfirm, chromePreview } from "../Controllers/import.controller.js";

const Routers = Router();
Routers.route("/preview").post(single, chromePreview);
Routers.route("/confirm").post(VerifyJWT, chromeConfirm);

export default Routers;
