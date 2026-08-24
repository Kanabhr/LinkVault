import { createContext, useContext, useState } from "react";
import { getuserlinks, savelink , deletelink , deletetag ,editlink,edittag } from "../api/linkApi.js";

export const LinkContext = createContext(null);

export function LinkProvider({ children }) {

const [links ,setLinks] = useState([])
const [customtags,setCustomtags] = useState([])
const [loading,setLoading]= useState(true)
const [error,setError]= useState(null)

 const fetchlinks = async () => {
  setLoading(true)                                    // start loading
  try {
    const res = await getuserlinks()
    const userLinks = res.data.data.UserLinks
    setLinks(userLinks)
    const tags = userLinks
      .map(link => link.customTagId)
      .filter(Boolean)
    setCustomtags(tags)
  } catch (err) {
    setError(err.response?.data?.message || "Failed to fetch links")
  } finally {
    setLoading(false)                                 // always runs, success or fail
  }
}

  const addlinks = async (data) => {
    const res = await savelink(data)
  const newlink = res.data.data
  setLinks(prev => [newlink,...prev]) //for adding
  }
  const removelink = async (id) => {
    await deletelink(id);
    setLinks(prev => prev.filter(link => link._id !==id))// for removing 
    
  }
    const removetag = async (id) => {
    await deletetag(id);
    setCustomtags(prev => prev.filter(link => link._id !==id))// for removing 
    
  }
  const updatelink = async (id ,data) =>{
    const res = await editlink(id, data)
    setLinks(prev => prev.map(link => link._id === id ? res.data.data : link))// for updating
  }
   const updatetag = async (id ,data) =>{
    const res = await edittag(id, data)
    setCustomtags(prev => prev.map(link => link._id === id ? res.data.data : link))// for updating
  }
  return (
    <LinkContext.Provider value={{ fetchlinks,addlinks,removelink,removetag,updatelink,updatetag,links,customtags,loading,error}}>
      {children}
    </LinkContext.Provider>
  );
}

export const useLinks = () => useContext(LinkContext);
