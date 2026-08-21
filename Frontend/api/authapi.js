import axiosService from "./axios";
const registerUser = (data) => axiosService.post("/users/register",data)
const LoginUser = (data) => axiosService.post("/users/login",data)
const ShowprofileUser = () => axiosService.get("/users/userprofile")
const LogoutUser = () => axiosService.post("/users/logout")
export {registerUser, LoginUser, ShowprofileUser, LogoutUser}