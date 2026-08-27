import { useLinks } from "../context/Linkcontext"
import { useAuth } from "../context/Authcontext"
import { useState, useEffect } from "react"

export default function UserProfile() {
  const { user } = useAuth()
  const { links, loading, error, fetchlinks, removelink, removetag, updatelink } = useLinks()

  // ── local state ──────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [editingId, setEditingId] = useState(null)
  const [editUrl, setEditUrl] = useState("")
  const [editCategory, setEditCategory] = useState("")
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState("")

  // ── fetch on mount if links not already loaded ───────────────
  useEffect(() => {
    if (links.length === 0) fetchlinks()
  }, [links.length, fetchlinks])

  // ── filtering ─────────────────────────────────────────────────
  const filteredLinks = links
    .filter(link => link.Linkdata.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(link => selectedCategory === "All" || link.CategoriesbyDef === selectedCategory)

  // ── delete link ───────────────────────────────────────────────
  const handleDeleteLink = async (id) => {
    await removelink(id)
  }

  // ── delete tag ────────────────────────────────────────────────
  const handleDeleteTag = async (id) => {
    await removetag(id)
  }

  // ── open edit mode ────────────────────────────────────────────
  const handleEditOpen = (link) => {
    setEditingId(link._id)
    setEditUrl(link.Linkdata)
    setEditCategory(link.CategoriesbyDef || "Personal")
    setEditError("")
  }

  // ── save edit ─────────────────────────────────────────────────
  const handleEditSave = async () => {
    if (!editUrl) { setEditError("URL cannot be empty"); return }
    setEditLoading(true)
    try {
      await updatelink(editingId, { Linkdata: editUrl, CategoriesbyDef: editCategory })
      setEditingId(null)
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update link")
    } finally {
      setEditLoading(false)
    }
  }

  // ── categories for filter pills ──────────────────────────────
  const CATEGORIES = ["All", "Personal", "Entertainment", "Knowledge", "Instagram"]

  // ── helper: get initials from URL ────────────────────────────
  const getInitials = (url) => {
    try {
      const hostname = new URL(url).hostname.replace("www.", "")
      return hostname.slice(0, 2).toUpperCase()
    } catch {
      return "??"
    }
  }

  // ── helper: get domain from URL ──────────────────────────────
  const getDomain = (url) => {
    try {
      return new URL(url).hostname.replace("www.", "")
    } catch {
      return url
    }
  }

  return (
    <div>

      <div>
        <span>My Bookmarks</span>

        <input
          type="text"
          placeholder="Search bookmarks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

   
        <select>
          <option>Newest First</option>
          <option>Oldest First</option>
        </select>

        <a href={`/u/${user?.username}`} target="_blank" rel="noreferrer">
          {user?.username}'s Profile
        </a>
      </div>

      <div>
        <h1>All Bookmarks</h1>
        <p>{links.length} saved links</p>
      </div>


      <div>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>


      {loading && <p>Loading your bookmarks...</p>}
      {error && <p>{error}</p>}
      {!loading && filteredLinks.length === 0 && <p>No bookmarks found</p>}

      <div>
        {filteredLinks.map(link => (
          <div key={link._id}>

            <div>
              <span>{getInitials(link.Linkdata)}</span>
              <span>{link.CategoriesbyDef || link.customTagId?.Customcat}</span>
              <button onClick={() => handleEditOpen(link)}>Edit</button>
              <button onClick={() => handleDeleteLink(link._id)}>Delete</button>
            </div>

            <div>
              <p>{link.Linkdata}</p>
              <p>{getDomain(link.Linkdata)}</p>
              <p>Added {new Date(link.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
            </div>

            <a href={link.Linkdata} target="_blank" rel="noreferrer">Open</a>

          </div>
        ))}
      </div>

      {editingId && (
        <div>
          <h3>Edit Bookmark</h3>
          <input
            type="url"
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            placeholder="URL"
          />
          <select
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
          >
            <option value="Personal">Personal</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Knowledge">Knowledge</option>
            <option value="Instagram">Instagram</option>
          </select>
          {editError && <p>{editError}</p>}
          <button onClick={handleEditSave} disabled={editLoading}>
            {editLoading ? "Saving..." : "Save"}
          </button>
          <button onClick={() => setEditingId(null)}>Cancel</button>
        </div>
      )}

    </div>
  )
}  