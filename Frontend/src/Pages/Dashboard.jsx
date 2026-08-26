import { useEffect, useState } from "react";
import { useLinks } from "../../context/Linkcontext";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/Authcontext";
export default function Dashboard(){
  const [linkText,setLinkText] = useState("")
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

const urlArray = linkText
  .split(/[\n, ]+/)
  .map(url => url.trim())
  .filter(url => url.length > 0)

if (urlArray.length === 0) {
  setError("Please provide at least one URL!")
  return
}
setLoading(true)
try {
  for (const singleUrl of urlArray) {
    const payload = Customtag
      ? { Linkdata: singleUrl, Customcat: Customtag }
      : { Linkdata: singleUrl, CategoriesbyDef: selectedCategory }
    await addlinks(payload)
  }
  setLinkText("")


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
<textarea
onChange={(e)=> setLinkText(e.target.value)}
required
rows={4}
value={linkText}
placeholder="Paste one or multiple URLs (separated by newline, space, or comma)"
/>
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
<Link to="/profile">My Profile</Link>
<Link to={`/u/${user?.username}`}>Public Profile</Link>
    <p>{error}</p> 
    </>
  )
}
