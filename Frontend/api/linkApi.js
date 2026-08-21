import axiosService from "./axios";
const savelink =(data)=>axiosService.post("/Linkdata/Mainpage",data);
const editlink =(id,data)=>axiosService.patch(`/Linkdata/Editpage/${id}`,data);
const edittag =(id,data)=>axiosService.patch(`/Linkdata/Edittags/${id}`,data);
const deletelink =(id)=>axiosService.delete(`/Linkdata/Deletelinks/${id}`,);
const deletetag =(id)=>axiosService.delete(`/Linkdata/Deletetags/${id}`,);
export {savelink,editlink,edittag,deletelink,deletetag}