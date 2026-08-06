import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { User } from "../MongoDB/Models/UserSchema.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { ValidPassword, ValidEmail, ValidUserName } from "../Utils/Validation.js";
import bcrypt from "bcrypt";
const RegisterUser = AsyncHandler(async (req, res) => {
  const { username, useremail, password } = req.body;

  if ([useremail, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "One of the fields is empty");
  }
  const ExistingUser = await User.findOne({ $or: [{ username }, { useremail }] });
  if (ExistingUser) {
    throw new ApiError(409, "User already Exists");
  }

  const user = await User.create({
    useremail,
    username: username.toLowerCase(),
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
  } else {
    console.log("login process successfully next step awaited");
  }

  const IsPasswordCorrect = await bcrypt.compare(password, CheckUser.password);
  if (IsPasswordCorrect) {
    res.status(201).json(new ApiResponse(200, "User Logged-In Successfully"));
  } else {
    throw new ApiError(500, "Please enter valid password");
  }
  // if (IspasswordCorrect === password) {
  //   res.status(201).json(new ApiResponse(200, "User Logged-In Successfully"));
  // } else {
  //   throw new ApiError(500, "Please enter valid password");
  // }
  // input validation
  // check if user is new
  // redirect user to register if new
  // log user and generate a token
});

const UserProfile = AsyncHandler(async (req, res) => {
  res.status(200).json({
    message: "This is User profile",
  });
});

export { RegisterUser, LoginUser, UserProfile };
