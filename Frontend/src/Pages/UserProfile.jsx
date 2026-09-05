import { useLinks } from "../context/Linkcontext";
import { useAuth } from "../context/Authcontext";
import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Bookmark, Search, ExternalLink, Pencil, Trash2,
  Check, X, AlertCircle, Globe
} from "lucide-react";
import "../styles/glass.css";
import "@fontsource-variable/geist";
import GlassSelect from "../components/GlassSelect";
import Sidebar from "../components/Sidebar";

const DOMAIN_COLORS = ["#1a1a2e","#1a0d0d","#0d0d1a","#0d1a16","#1a160d","#101a1a"];
function getInitials(url) {
  try { return new URL(url).hostname.replace("www.","").slice(0,2).toUpperCase(); }
  catch { return "??" }
}
function getDomain(url) {
  try { return new URL(url).hostname.replace("www.",""); }
  catch { return url; }
}
function domainColor(url) {
  try { const h=new URL(url).hostname; return DOMAIN_COLORS[h.charCodeAt(0)%DOMAIN_COLORS.length]; }
  catch { return DOMAIN_COLORS[0]; }
}

export default function UserProfile() {
  const { user } = useAuth();
  const { links, loading, error, fetchlinks, removelink, updatelink } = useLinks();
  const reduce = useReducedMotion();

  const [searchTerm,       setSearchTerm]       = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingId,        setEditingId]        = useState(null);
  const [editUrl,          setEditUrl]          = useState("");
  const [editCategory,     setEditCategory]     = useState("");
  const [editLoading,      setEditLoading]      = useState(false);
  const [editError,        setEditError]        = useState("");

  useEffect(() => { fetchlinks(); }, []);

  const filteredLinks = links
    .filter(l => l.Linkdata.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(l => selectedCategory === "All" || l.CategoriesbyDef === selectedCategory);

  const handleDeleteLink = async (id) => { await removelink(id); };

  const handleEditOpen = (link) => {
    setEditingId(link._id);
    setEditUrl(link.Linkdata);
    setEditCategory(link.CategoriesbyDef || "Personal");
    setEditError("");
  };

  const handleEditSave = async () => {
    if (!editUrl) { setEditError("URL cannot be empty"); return; }
    setEditLoading(true);
    try {
      await updatelink(editingId, { Linkdata: editUrl, CategoriesbyDef: editCategory });
      setEditingId(null);
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update link");
    } finally {
      setEditLoading(false);
    }
  };

  const CATEGORIES = ["All","Personal","Entertainment","Knowledge","Instagram"];

  return (
    <div style={{ position:"relative",minHeight:"100dvh",display:"flex",overflowX:"hidden" }}>
      <div className="page-bg" aria-hidden="true" />
      <Sidebar />

      <main role="main" className="app-main" style={{ flex:1,minWidth:0,position:"relative",zIndex:1,padding:"32px 32px 64px" }}>
        {/* Header */}
        <motion.div
          {...(reduce ? {} : { initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:0.5,ease:[0.16,1,0.3,1]} })}
          style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:24 }}
        >
          <div>
            <h1 style={{ fontSize:"clamp(22px,2.5vw,32px)",fontWeight:720,letterSpacing:"-0.025em",color:"var(--text-primary)",marginBottom:4 }}>
              My Bookmarks
            </h1>
            <p style={{ fontSize:14,color:"var(--text-secondary)" }}>
              {loading ? "Loading..." : `${links.length} saved link${links.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <a href={`/u/${user?.username}`} target="_blank" rel="noreferrer" style={{ textDecoration:"none" }}>
            <button className="btn-ghost" style={{ height:38,fontSize:13,gap:8 }}>
              <Globe size={14} strokeWidth={1.75} />
              Public Profile
            </button>
          </a>
        </motion.div>

        {/* Search + filters */}
        <motion.div
          {...(reduce ? {} : { initial:{opacity:0,y:12},animate:{opacity:1,y:0},transition:{duration:0.45,delay:0.08,ease:[0.16,1,0.3,1]} })}
          style={{ marginBottom:20 }}
        >
          {/* Search — full width on mobile via CSS */}
          <div className="input-wrapper search-wrapper" style={{ marginBottom:14,maxWidth:400 }}>
            <span className="input-icon" aria-hidden="true">
              <Search size={16} strokeWidth={1.75} />
            </span>
            <input
              type="search"
              className="input-glass"
              placeholder="Search bookmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search bookmarks"
            />
          </div>
          {/* Category filter pills — horizontal scroll on mobile */}
          <div className="cat-filter-row">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? "btn-primary" : "btn-ghost"}
                style={{ height:32,padding:"0 14px",fontSize:12,fontWeight:selectedCategory===cat?600:500 }}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {error && (
          <div className="error-banner" role="alert" style={{ marginBottom:16 }}>
            <AlertCircle size={15} strokeWidth={2} style={{ flexShrink:0 }} />
            {error}
          </div>
        )}

        {/* Links */}
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {loading ? (
            [0,1,2,3,4].map(i => (
              <div key={i} style={{ opacity:1-i*0.15 }}>
                <div className="glass r-lg" style={{ display:"flex",alignItems:"center",gap:14,padding:"16px" }}>
                  <div style={{ width:40,height:40,borderRadius:10,background:"var(--glass-bg-default)",flexShrink:0 }} />
                  <div style={{ flex:1,display:"flex",flexDirection:"column",gap:8 }}>
                    <div style={{ height:13,borderRadius:4,background:"var(--glass-bg-default)",width:"45%" }} />
                    <div style={{ height:11,borderRadius:4,background:"var(--glass-bg-subtle)",width:"65%" }} />
                  </div>
                  <div style={{ width:70,height:22,borderRadius:999,background:"var(--glass-bg-default)" }} />
                </div>
              </div>
            ))
          ) : filteredLinks.length === 0 ? (
            <div className="glass r-lg" style={{ textAlign:"center",padding:"48px 24px" }}>
              <Bookmark size={32} color="var(--text-muted)" strokeWidth={1.5} style={{ margin:"0 auto 14px" }} />
              <p style={{ fontSize:15,color:"var(--text-secondary)",fontWeight:600,marginBottom:4 }}>
                {links.length === 0 ? "No bookmarks yet" : "No bookmarks match your search"}
              </p>
              <p style={{ fontSize:13,color:"var(--text-muted)" }}>
                {links.length === 0 ? "Head to Dashboard to add your first bookmark" : "Try adjusting your search or filter"}
              </p>
            </div>
          ) : (
            filteredLinks.map((link, i) => (
              <motion.div
                key={link._id}
                {...(reduce ? {} : {
                  initial:{opacity:0,y:10},
                  animate:{opacity:1,y:0},
                  transition:{duration:0.35,delay:i*0.04,ease:[0.16,1,0.3,1]},
                })}
                className="glass r-lg"
                style={{ padding:"14px 16px" }}
              >
                {/* Main row */}
                <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ width:40,height:40,borderRadius:10,background:domainColor(link.Linkdata),border:"1px solid var(--glass-border)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"var(--text-secondary)",flexShrink:0 }}>
                    {getInitials(link.Linkdata)}
                  </div>

                  <div style={{ flex:1,minWidth:0 }}>
                    <p style={{ fontSize:14,fontWeight:600,color:"var(--text-primary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2 }}>
                      {getDomain(link.Linkdata)}
                    </p>
                    <p style={{ fontSize:11,color:"var(--text-muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                      {link.Linkdata}
                    </p>
                  </div>

                  <div className="bookmark-card-actions" style={{ display:"flex",alignItems:"center",gap:8,flexShrink:0 }}>
                    <span className="badge" style={{ fontSize:10 }}>
                      {link.CategoriesbyDef || link.customTagId?.Customcat}
                    </span>
                    <p className="bookmark-card-meta" style={{ fontSize:11,color:"var(--text-muted)",whiteSpace:"nowrap" }}>
                      {new Date(link.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}
                    </p>
                    <a href={link.Linkdata} target="_blank" rel="noreferrer" aria-label={`Open ${getDomain(link.Linkdata)}`}>
                      <button className="btn-icon" style={{ width:32,height:32 }} tabIndex={-1}>
                        <ExternalLink size={13} strokeWidth={1.75} />
                      </button>
                    </a>
                    <button className="btn-icon" style={{ width:32,height:32 }} onClick={() => handleEditOpen(link)} aria-label="Edit bookmark">
                      <Pencil size={13} strokeWidth={1.75} />
                    </button>
                    <button className="btn-icon" style={{ width:32,height:32,color:"rgb(255 49 98 / 0.60)" }} onClick={() => handleDeleteLink(link._id)} aria-label="Delete bookmark">
                      <Trash2 size={13} strokeWidth={1.75} />
                    </button>
                  </div>
                </div>

                {/* Inline edit panel */}
                {editingId === link._id && (
                  <motion.div
                    {...(reduce ? {} : { initial:{opacity:0,y:-8},animate:{opacity:1,y:0},transition:{duration:0.22,ease:[0.16,1,0.3,1]} })}
                    className="glass-subtle r-md"
                    style={{ marginTop:12,padding:"14px",display:"flex",flexDirection:"column",gap:10 }}
                  >
                    <div style={{ display:"grid",gridTemplateColumns:"1fr auto",gap:10 }}>
                      <input
                        type="url"
                        className="input-glass"
                        style={{ height:40,fontSize:13 }}
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        placeholder="URL"
                        aria-label="Edit URL"
                      />
                      <GlassSelect
                        value={editCategory}
                        onChange={setEditCategory}
                        options={["Personal","Entertainment","Knowledge","Instagram"]}
                        aria-label="Edit category"
                        height={40}
                        fontSize={13}
                      />
                    </div>
                    {editError && (
                      <div className="error-banner" role="alert">
                        <AlertCircle size={13} strokeWidth={2} style={{ flexShrink:0 }} />
                        {editError}
                      </div>
                    )}
                    <div style={{ display:"flex",gap:8,justifyContent:"flex-end" }}>
                      <button className="btn-ghost" style={{ height:34,padding:"0 14px",fontSize:12 }} onClick={() => setEditingId(null)}>
                        <X size={13} strokeWidth={2} /> Cancel
                      </button>
                      <button className="btn-primary" style={{ height:34,padding:"0 14px",fontSize:12 }} onClick={handleEditSave} disabled={editLoading}>
                        {editLoading
                          ? <span style={{ display:"inline-block",width:13,height:13,borderRadius:"50%",border:"2px solid rgb(255 255 255 / 0.30)",borderTopColor:"#fff",animation:"spin 0.7s linear infinite" }} aria-hidden="true" />
                          : <Check size={13} strokeWidth={2} />
                        }
                        Save
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
