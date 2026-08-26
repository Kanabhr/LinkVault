import { urldata } from "../MongoDB/Models/Urlschema.js";
import { CustomTag } from "../MongoDB/Models/Urlschema.js";
import { User } from "../MongoDB/Models/UserSchema.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { InputValidation } from "../Utils/Validation.js";
const SaveLinks = AsyncHandler(async (req, res) => {
  const { Linkdata, CategoriesbyDef, Customcat } = req.body;
  console.log("Link is :", Linkdata, "Category is :", Customcat);
  if (!InputValidation(Linkdata)) {
    throw new ApiError(500, "Cannot be empty");
  }
  const categoryToSave = Customcat ? null : CategoriesbyDef || "Personal";
let savedata
if (Customcat) {
  // user wants a custom tag
  const savetag = await CustomTag.create({
    UserID: req.user._id,
    Customcat,
  })
 savedata = await urldata.create({
    userId: req.user._id,
    Linkdata,
    CategoriesbyDef: null,      // no preset category when custom tag is used
    customTagId: savetag._id,
  })
} else {
  // no custom tag — use preset category or default to Personal
  savedata = await urldata.create({
    userId: req.user._id,
    Linkdata,
    CategoriesbyDef: categoryToSave,  // "Personal" or user's choice
    // customTagId defaults to null from schema
  })
}

  if (!savedata) {
    throw new ApiError(400, "Error occured while saving links");
  }
  return res.status(200).json(new ApiResponse(200, savedata, "Link Saved"));
});
// in mongo when using create we need only to include required: true fields defined in schema
const EditLinkdata = AsyncHandler(async (req, res) => {
  const { Linkdata, CategoriesbyDef } = req.body;
 const updatedlinkdata =  await urldata.findByIdAndUpdate(
    req.params.id,
    {
      $set: { Linkdata, CategoriesbyDef },
    },
    { new: true },
  );
  res.status(200).json(new ApiResponse(200,updatedlinkdata, "Linkdata fields edited successfully"));
});
const EditCustomTag = AsyncHandler(async (req, res) => {
  const { Customcat } = req.body;
 const updatedtag = await CustomTag.findByIdAndUpdate(
    req.params.id,
    {
      $set: { Customcat },
    },
    { new: true },
  );
  res.status(200).json(new ApiResponse(200,updatedtag, "Custom tag edited successfully"));
});
const DeleteLinks = AsyncHandler(async (req,res) => {

  await urldata.findByIdAndDelete(req.params.id)
  res.status(200).json(new ApiResponse(200,"Linkdata deleted successfully"))
})
const DeleteTags = AsyncHandler(async (req,res) => {
  
  await CustomTag.findByIdAndDelete(req.params.id)
  res.status(200).json(new ApiResponse(200,"Tag deleted successfully"))
})
const getPublicBookmarks  = AsyncHandler(async (req,res) => {
  const userbyname = await User.findOne({username: req.params.username})
if(!userbyname){
  throw new ApiError(404,"User not found")
}
  const Publicbookmarks = await urldata.find({ userId: userbyname._id }).populate("customTagId").populate("userId", "username useremail");
  res.status(200).json(new ApiResponse(200,  Publicbookmarks , "User data fetched"));
})

export { SaveLinks, EditLinkdata, EditCustomTag ,DeleteLinks,DeleteTags,getPublicBookmarks};
