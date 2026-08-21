import axios from "axios";
const axiosService = axios.create({
  baseURL: "/api/v1",
  timeout: 10000,
  withCredentials:true,
  headers:{
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});
export default axiosService