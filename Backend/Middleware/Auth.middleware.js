import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { User } from "../MongoDB/Models/UserSchema.js";
import jwt from "jsonwebtoken";
const VerifyJWT = AsyncHandler(async (req, res, next) => {
  try {
    const Token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!Token) {
      throw new ApiError(401, "Unauthorized user");
    }
    const DecodedToken = jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(DecodedToken?._id).select("-password -RefreshToken");
    if (!user) {
      throw new ApiError(401, "Invalid Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid Access Token");
  }
});

export { VerifyJWT };
