import { Router } from "express";
import { getCurrentUser, RegisterUser, LoginUser, UserProfile, LogoutUser } from "../Controllers/User.controller.js";
import { getPublicBookmarks } from "../Controllers/Linkdata.controller.js";
import { VerifyJWT } from "../Middleware/Auth.middleware.js";

const router = Router();

router.route("/register").post(RegisterUser);
router.route("/login").post(LoginUser);
router.route("/logout").post(VerifyJWT, LogoutUser);
router.route("/userprofile").get(VerifyJWT, UserProfile);
router.route("/me").get(VerifyJWT, getCurrentUser);
router.route("/u/:username/public").get(getPublicBookmarks);  // no VerifyJWT — public

export default router;
