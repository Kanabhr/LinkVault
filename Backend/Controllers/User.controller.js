import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { User } from "../MongoDB/Models/UserSchema.js";
import { urldata } from "../MongoDB/Models/Urlschema.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { ValidPassword, ValidEmail, ValidUserName, InputValidation } from "../Utils/Validation.js";
import bcrypt from "bcrypt";
const generateAccessandRefreshToken = async (userid) => {
  try {
    const user = await User.findById(userid);
    const accesstoken = user.generateAccessToken();
    const refreshtoken = user.generateRefreshToken();
    user.RefreshToken = refreshtoken;
    await user.save({ validateBeforeSave: false });
    return { accesstoken, refreshtoken };
  } catch (error) {
    throw new ApiError(500, "Error while token generation");
  }
};
const RegisterUser = AsyncHandler(async (req, res) => {
  const { username, useremail, password } = req.body;

  if (!InputValidation(useremail) || !InputValidation(username) || !InputValidation(password)) {
    throw new ApiError(400, "One of the fields is empty");
  }
  const ExistingUser = await User.findOne({ $or: [{ username }, { useremail }] });
  if (ExistingUser) {
    throw new ApiError(409, "User already Exists");
  }
  const passworderr = ValidPassword(req.body.password);
  const usernameerr = ValidUserName(req.body.username);
  const useremailerr = ValidEmail(req.body.useremail);
  if (!passworderr || !useremailerr || !usernameerr) {
    throw new ApiError(400, "Validation gone wrong");
  }

  const user = await User.create({
    useremail,
    username,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password -RefreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Server error while registering user");
  }
  res.status(201).json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

const LoginUser = AsyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if ([username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "One of the fields is empty");
  }
  const CheckUser = await User.findOne({ username });
  if (!CheckUser) {
    throw new ApiError(408, "User doesn't exist please register first");
  }
  const IsPasswordCorrect = await bcrypt.compare(password, CheckUser.password);

  if (!IsPasswordCorrect) {
    throw new ApiError(401, "Wrong user credentials entered");
  }
  const safeUser = await User.findById(CheckUser._id).select("-password -RefreshToken");
  const { accesstoken, refreshtoken } = await generateAccessandRefreshToken(CheckUser._id);
  const Cookieoptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"

  };
  return res.status(200).cookie("accessToken", accesstoken, Cookieoptions).cookie("refreshToken", refreshtoken, Cookieoptions).json({
    message: "User Logged In",
    user: safeUser,
  });
});
const LogoutUser = AsyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true },
  );
  const Cookieoptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"

  };
  return res
    .status(200)
    .clearCookie("accesstoken", Cookieoptions)
    .clearCookie("refreshtoken", Cookieoptions)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});
const UserProfile = AsyncHandler(async (req, res) => {
  const UserLinks = await urldata.find({ userId: req.user._id }).populate("customTagId").populate("userId", "username useremail");
  res.status(200).json(new ApiResponse(200, { UserLinks }, "User data fetched"));
});
const getCurrentUser = AsyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.user, "User fetched"));
});

export { RegisterUser, LoginUser, UserProfile, LogoutUser, getCurrentUser };
