import { Router } from "express";
import { RegisterUser } from "../Controllers/User.controller.js";
import { LoginUser } from "../Controllers/User.controller.js";
import { UserProfile } from "../Controllers/User.controller.js";
const router = Router();
router.route("/register").post(RegisterUser);
router.route("/login").post(LoginUser);
router.route("/userprofile").get(UserProfile);
export default router;
