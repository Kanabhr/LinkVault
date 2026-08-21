import { User } from "../MongoDB/Models/UserSchema.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "./ApiResponse.js";
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PassRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
function ValidEmail(email) {
  if (typeof email === "string" && emailRegex.test(email)) {
    return true;
  } else {
    return false;
  }
}
function ValidUserName(Username) {
  if (typeof Username === "string" && Username.length >= 5 && Username.length <= 16) {
    return true;
  } else {
    return false;
  }
}
function ValidPassword(password) {
  if (typeof password === "string" && PassRegex.test(password) && password.length >= 8) {
    return true;
  } else {
    return false;
  }
}
function InputValidation(input) {
  if ([input].some((field) => field?.trim() === "")) {
    return false;
  } else {
    return true;
  }
}

export { ValidEmail, ValidPassword, ValidUserName, InputValidation };
