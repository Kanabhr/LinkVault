import { Router } from "express";
import { connect, callback, status, revoke, getPlaylists, youtubePreview, youtubeConfirm } from "../Controllers/OAuth.controller.js";
import { VerifyJWT } from "../Middleware/Auth.middleware.js";
const Routers = Router()
// OAuth Routes
Routers.route("/connect").get(VerifyJWT, connect)
Routers.route("/callback").get(callback)
Routers.route("/status").get(VerifyJWT, status)
Routers.route("/revoke").delete(VerifyJWT, revoke)
// Youtube Routes
Routers.route("/playlists").get(VerifyJWT, getPlaylists)
Routers.route("/preview").post(VerifyJWT, youtubePreview)
Routers.route("/confirm").post(VerifyJWT, youtubeConfirm)
export default Routers