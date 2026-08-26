import { getpubliclinks } from "../../api/linkApi"
import { useState,useEffect  } from "react";
import { useParams } from "react-router-dom";
export default function Publicprofile(){
const [link,setLink] = useState([])
 const {username} = useParams()
const [error, setError] = useState("");
const [loading, setLoading] = useState(true);
useEffect( ()=>{
    const fetchData = async () => {
         setLoading(true)
   try {
    const res = await getpubliclinks(username)
    setLink(res.data.data)
   } catch (err) {
    setError(err.response?.data?.message || "Failed to load bookmarks")
   }
   finally{
    setLoading(false)
   }
    }
    fetchData()
},[username])
    return<>
    
    <div>
        <h1>{username}'s Bookmarks</h1>
           {link.map((links) => (
        <div key={links._id}>
          <p>{links.Linkdata}</p>
          <p> {links.CategoriesbyDef}</p>
          <a href={links.Linkdata} target="_blank" rel="noreferrer">Open</a>
        </div>
      ))}
    </div>

    </>
}