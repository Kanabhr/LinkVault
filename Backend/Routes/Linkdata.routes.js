import { Router } from "express";
import { SaveLinks } from "../Controllers/Linkdata.controller.js";
import { EditLinksandTag } from "../Controllers/Linkdata.controller.js";
const Routers = Router();
Routers.route("/Mainpage").post(SaveLinks);
Routers.route("/Editpage").patch(EditLinksandTag);
export default Routers;
