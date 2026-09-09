import { Router } from "express";
import  { connect,callback,status,revoke } from "../Controllers/OAuth.controller.js";
import { VerifyJWT } from "../Middleware/Auth.middleware.js";
const Routers = Router()
Routers.route("/connect").get(VerifyJWT,connect)
Routers.route("/callback").get(callback)
Routers.route("/status").get(VerifyJWT,status)
Routers.route("/revoke").delete(VerifyJWT, revoke)

export default Routers