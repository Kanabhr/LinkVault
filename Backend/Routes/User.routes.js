import { Router } from "express";
import { RegisterUser } from "../Controllers/User.controller.js";
import { LoginUser } from "../Controllers/User.controller.js";
import { UserProfile } from "../Controllers/User.controller.js";
import { LogoutUser } from "../Controllers/User.controller.js";
import { VerifyJWT } from "../Middleware/Auth.middleware.js";
const router = Router();
router.route("/register").post(RegisterUser);
router.route("/login").post(LoginUser);
router.route("/logout").post(VerifyJWT, LogoutUser);
router.route("/userprofile").get(VerifyJWT, UserProfile);

export default router;
