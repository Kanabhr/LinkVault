import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 18,
      trim: true,
    },
    useremail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    RefreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);
userSchema.pre("save", async function () {
  // Only hash the password if it has been modified (or is new)
  if (this.isModified("password")) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      // If you need to handle an error, throw it; Mongoose will catch it
      throw error;
    }
  }
}); // it is a hook(mongoose middleware)
userSchema.methods.IsPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
}; // it is a instance method
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.useremail,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};
export const User = mongoose.model("User", userSchema);
