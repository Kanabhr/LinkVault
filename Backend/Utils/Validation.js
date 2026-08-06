import { User } from "../MongoDB/Models/UserSchema.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "./ApiResponse.js";
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PassRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
function ValidEmail(email) {
  if (typeof email === "string" && emailRegex.test(email)) {
    return null;
  } else {
    console.log("Please provide a valid email address");
  }
}
function ValidUserName(Username) {
  if (typeof Username === "string" && Username.length >= 5 && Username.length <= 16) {
    return null;
  } else {
    console.log("Username cannot be more than 16 and less than 5 characters");
  }
}
function ValidPassword(password) {
  if (typeof password === "string" && PassRegex.test(password) && password.length >= 8) {
    return null;
  } else {
    console.log("Password must be minimum 8 word long and contain unique symbols");
  }
}
function InputValidation(useremail, username, password) {
  if ([useremail, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400);
  } else {
    return true;
  }
}
function IsUserRegistered() {
  const ExistingUser = User.findOne({ $or: [{ username }, { useremail }] });
  if (ExistingUser) {
    throw new ApiError(409, "User already exists");
  } else {
    return true;
  }
}
function UserExists(username) {
  const UserExists = User.findOne({ username });
  if (UserExists) {
    throw new ApiResponse(200, "Login Successfull");
  } else {
    throw new ApiError(409, "Please register first");
  }
}
export { ValidEmail, ValidPassword, ValidUserName, InputValidation, IsUserRegistered, UserExists };
