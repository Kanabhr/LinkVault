import axios from "axios";
const axiosService = axios.create({
  baseURL: "/api/v1",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
axiosService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/users/login")
    ) {
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)
export default axiosService 
