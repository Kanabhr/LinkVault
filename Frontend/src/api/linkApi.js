import axiosService from "./axios";

const savelink        = (data)     => axiosService.post("/Linkdata/Mainpage", data);
const getuserlinks    = ()         => axiosService.get("/users/userprofile");
const editlink        = (id, data) => axiosService.patch(`/Linkdata/Editpage/${id}`, data);
const edittag         = (id, data) => axiosService.patch(`/Linkdata/Edittags/${id}`, data);
const deletelink      = (id)       => axiosService.delete(`/Linkdata/Deletelinks/${id}`);
const deletetag       = (id)       => axiosService.delete(`/Linkdata/Deletetags/${id}`);
const getpubliclinks  = (username) => axiosService.get(`/users/u/${username}/public`); // no auth needed

export { savelink, editlink, edittag, deletelink, deletetag, getuserlinks, getpubliclinks }