import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLinks } from "../../context/Linkcontext";
import { useAuth } from "../../context/Authcontext";
export default function Dashboard(){
  // const navigate = useNavigate()
  const [link,setLink] = useState("")
  const [Customtag,setCustomtag] = useState("")
  const [selectedCategory,setSelectedCategory] = useState("Personal")
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("")
const {user}= useAuth()
const { fetchlinks, addlinks, links, loading: linksLoading, error: linksError } = useLinks()

useEffect(()=>{
fetchlinks()
  },[])

  const handleEvent = async (e) => {
    e.preventDefault()
    if(!link){
setError("Url field cannot be empty!")
return;
    }
    setLoading(true)
    try {
   if (Customtag) {
  await addlinks({ Linkdata: link, Customcat: Customtag })
} else {
  await addlinks({ Linkdata: link, CategoriesbyDef: selectedCategory })
}
setLink("")
setCustomtag("")
setSelectedCategory("Personal")
setError("")

    } catch (err) {
        setError(err.response?.data?.message || "Linkdata saving Failed")
    }
      finally{
      setLoading(false)
    }
  }
  return(
    <>
    <div>
      <p>Welcome, {user?.username}</p>
      <form  onSubmit={handleEvent}>
<input type="url" name="" id="" placeholder="Paste your URls here" value={link} onChange={(e)=>setLink(e.target.value)} required/>
<select name="" id="" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
<option value="Personal">Personal</option>
<option value="Entertainment">Entertainment</option>
<option value="Knowledge">Knowledge</option>
<option value="Instagram">Instagram</option>
</select>
<input type="text" name="" id="" placeholder="Create a custom tag" value={Customtag} onChange={(e)=>setCustomtag(e.target.value)} />
 <button type="submit" disabled={loading}>
  {loading ? "Saving..." : "Save"}
</button>
      </form>
    </div>
    {linksLoading && <p>Loading your links...</p>}
{linksError && <p>{linksError}</p>}
{links.map(link => (
  <div key={link._id}>
    <p>{link.Linkdata}</p>
    <p>{link.CategoriesbyDef || link.customTagId?.Customcat}</p>
  </div>
))}

    <p>{error}</p> 
    </>
  )
}
