import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
const CustomCategory = new mongoose.Schema(
  {
    UserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Customcat: {
      type: String,
      required: true,
    },
    parentTag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomTag",
      default: null,
    },
    Isprivate: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
export const CustomTag = mongoose.model("CustomTag", CustomCategory);
const urlschema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Linkdata: {
      required: true,
      type: String,
    },
    CategoriesbyDef: {
      type: String,
      default: "Personal",
    },
    customTagId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomTag", // points to the tag document
      default: null,
    },
  },
  { timestamps: true },
);
// CustomCategory.pre("save", async function (next) {
//   if (this.Isprivate == true) {
//     console.log(`${this.Isprivate} is now a private category`);
//   }
//   next();
// });
export const urldata = mongoose.model("urldata", urlschema);
