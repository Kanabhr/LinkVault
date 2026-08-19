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
      // it should be optional and if a customcat is created user should get option to save in existing custom category
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
      enum: ["Personal", "Entertainment", "Knowledge", "Instagram"],
    }, // either select from this or not so if customcat is not created or checked it should be default personal
    customTagId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomTag", // points to the tag document
      default: null,
    },
  },
  { timestamps: true },
);
export const urldata = mongoose.model("urldata", urlschema);
