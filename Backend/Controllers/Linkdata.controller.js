import { urldata } from "../MongoDB/Models/Urlschema.js";
import { CustomTag } from "../MongoDB/Models/Urlschema.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
const SaveLinks = AsyncHandler(async (req, res, next) => {
  // fields: Link , selection from pre-defined category sub field : a tag creation
  const { Linkdata, Customcat } = req.body;
  console.log("Link is :", Linkdata, "Category is :", Customcat);
  throw new ApiResponse(200, "data received");
  // take user input with validation
  // verify tag is not duplicate
  // verify link is safe and valid
  // provide option of selecting existing category
  // take custom tag as input if user opts
});
const EditLinksandTag = AsyncHandler(async (req, res, next) => {
  // this function will be called only when user needs to edit existing tags or link
});
export { SaveLinks, EditLinksandTag };
