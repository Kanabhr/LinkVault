import axiosService from "./axios.js";

const registerUser    = (data) => axiosService.post("/users/register", data)
const LoginUser       = (data) => axiosService.post("/users/login", data)
const LogoutUser      = ()     => axiosService.post("/users/logout")
const getCurrentUser  = ()     => axiosService.get("/users/me")

export { registerUser, LoginUser, LogoutUser, getCurrentUser }