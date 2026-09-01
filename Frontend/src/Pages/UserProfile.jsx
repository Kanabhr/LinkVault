import { useLinks } from "../context/Linkcontext";
import { useAuth } from "../context/Authcontext";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import {
  Bookmark, Search, ExternalLink, Pencil, Trash2, Globe,
  User, Layers, LayoutDashboard, LogOut, Check, X, AlertCircle
} from "lucide-react";
import "../styles/glass.css";
import "@fontsource-variable/geist";

const NAV_ITEMS = [
  { to: "/dashboard",  icon: LayoutDashboard, label: "Dashboard"  },
  { to: "/profile",    icon: User,            label: "Profile"    },
  { to: "/categories", icon: Layers,          label: "Categories" },
];

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

function AppSidebar({ user, logout }) {
  const location = useLocation();
  return (
    <aside
      className="glass-strong"
      style={{
        position:"fixed",top:0,left:0,bottom:0,width:260,zIndex:40,
        display:"flex",flexDirection:"column",padding:"20px 12px",
        borderRight:"1px solid var(--glass-border)",borderRadius:0,
        background:"rgb(10 10 14 / 0.72)",
        backdropFilter:"blur(32px) saturate(200%)",
        WebkitBackdropFilter:"blur(32px) saturate(200%)",
      }}
      role="navigation" aria-label="App navigation"
    >
      <Link to="/dashboard" style={{ display:"flex",alignItems:"center",gap:8,textDecoration:"none",marginBottom:28,paddingLeft:4 }}>
        <div className="nav-logo-mark">B</div>
        <span style={{ fontSize:17,fontWeight:700,letterSpacing:"-0.02em",color:"var(--text-primary)" }}>BMS</span>
      </Link>
      <nav style={{ display:"flex",flexDirection:"column",gap:4,flex:1 }}>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} style={{ textDecoration:"none" }}>
              <div className={active ? "glass r-md" : "r-md"} style={{
                display:"flex",alignItems:"center",gap:10,padding:"10px 12px",
                color:active?"var(--text-primary)":"var(--text-secondary)",
                background:active?"var(--glass-bg-default)":"transparent",
                borderRadius:"var(--r-md)",
                transition:"background var(--dur-base) var(--ease-out),color var(--dur-base) var(--ease-out)",cursor:"pointer",
              }}>
                <Icon size={16} strokeWidth={active?2.2:1.75} color={active?"var(--accent)":"var(--text-secondary)"} />
                <span style={{ fontSize:14,fontWeight:active?600:500 }}>{label}</span>
                {active && <div style={{ marginLeft:"auto",width:5,height:5,borderRadius:"50%",background:"var(--accent)" }} />}
              </div>
            </Link>
          );
        })}
        <a href={`/u/${user?.username}`} target="_blank" rel="noreferrer" style={{ textDecoration:"none" }}>
          <div className="r-md" style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 12px",color:"var(--text-secondary)",cursor:"pointer",borderRadius:"var(--r-md)",transition:"background var(--dur-base) var(--ease-out)" }}>
            <Globe size={16} strokeWidth={1.75} />
            <span style={{ fontSize:14,fontWeight:500 }}>Public Profile</span>
            <ExternalLink size={12} strokeWidth={1.75} style={{ marginLeft:"auto",opacity:0.5 }} />
          </div>
        </a>
      </nav>
      <div style={{ borderTop:"1px solid var(--glass-border)",paddingTop:12 }}>
        <div className="glass-subtle r-md" style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 12px",marginBottom:8 }}>
          <div style={{ width:32,height:32,borderRadius:"50%",background:"var(--accent-dim)",border:"1px solid rgb(255 49 98 / 0.28)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:12,fontWeight:700,color:"var(--accent)" }}>
            {user?.username?.[0]?.toUpperCase()??"U"}
          </div>
          <p style={{ fontSize:13,fontWeight:600,color:"var(--text-primary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1 }}>
            {user?.username}
          </p>
        </div>
        <button onClick={logout} className="btn-ghost full" style={{ height:38,fontSize:13,gap:8,justifyContent:"center" }}>
          <LogOut size={14} strokeWidth={1.75} />
          Sign out
        </button>
      </div>
    </aside>
  );
}

export default function UserProfile() {
  const { user, logout } = useAuth();
  const { links, loading, error, fetchlinks, removelink, removetag, updatelink } = useLinks();
  const reduce = useReducedMotion();

  const [searchTerm,      setSearchTerm]      = useState("");
  const [selectedCategory,setSelectedCategory]= useState("All");
  const [editingId,       setEditingId]       = useState(null);
  const [editUrl,         setEditUrl]         = useState("");
  const [editCategory,    setEditCategory]    = useState("");
  const [editLoading,     setEditLoading]     = useState(false);
  const [editError,       setEditError]       = useState("");

  useEffect(() => { if (links.length === 0) fetchlinks(); }, [links.length, fetchlinks]);

  const filteredLinks = links
    .filter(l => l.Linkdata.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(l => selectedCategory === "All" || l.CategoriesbyDef === selectedCategory);

  const handleDeleteLink = async (id) => { await removelink(id); };
  const handleDeleteTag  = async (id) => { await removetag(id); };

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
    <div style={{ position:"relative",minHeight:"100dvh",display:"flex" }}>
      <div className="page-bg" aria-hidden="true" />
      <AppSidebar user={user} logout={logout} />

      <main role="main" style={{ flex:1,marginLeft:260,position:"relative",zIndex:1,padding:"32px 32px 64px" }}>
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
          <div className="input-wrapper" style={{ marginBottom:14, maxWidth:400 }}>
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
          <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
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

        {/* Error */}
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
                layout
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
                  <div style={{
                    width:40,height:40,borderRadius:10,background:domainColor(link.Linkdata),
                    border:"1px solid var(--glass-border)",display:"flex",alignItems:"center",
                    justifyContent:"center",fontSize:12,fontWeight:700,color:"var(--text-secondary)",flexShrink:0,
                  }}>
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

                  <div style={{ display:"flex",alignItems:"center",gap:8,flexShrink:0 }}>
                    <span className="badge" style={{ fontSize:10 }}>
                      {link.CategoriesbyDef || link.customTagId?.Customcat}
                    </span>
                    <p style={{ fontSize:11,color:"var(--text-muted)",whiteSpace:"nowrap" }}>
                      {new Date(link.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}
                    </p>
                    <a href={link.Linkdata} target="_blank" rel="noreferrer" aria-label={`Open ${getDomain(link.Linkdata)}`}>
                      <button className="btn-icon" style={{ width:32,height:32 }} tabIndex={-1}>
                        <ExternalLink size={13} strokeWidth={1.75} />
                      </button>
                    </a>
                    <button
                      className="btn-icon"
                      style={{ width:32,height:32 }}
                      onClick={() => handleEditOpen(link)}
                      aria-label="Edit bookmark"
                    >
                      <Pencil size={13} strokeWidth={1.75} />
                    </button>
                    <button
                      className="btn-icon"
                      style={{ width:32,height:32,color:"rgb(255 49 98 / 0.60)" }}
                      onClick={() => handleDeleteLink(link._id)}
                      aria-label="Delete bookmark"
                    >
                      <Trash2 size={13} strokeWidth={1.75} />
                    </button>
                  </div>
                </div>

                {/* Inline edit panel */}
                {editingId === link._id && (
                  <motion.div
                    {...(reduce ? {} : { initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},transition:{duration:0.28,ease:[0.16,1,0.3,1]} })}
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
                      <select
                        className="input-glass"
                        style={{ height:40,fontSize:13,width:150,cursor:"pointer" }}
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        aria-label="Edit category"
                      >
                        <option value="Personal">Personal</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Knowledge">Knowledge</option>
                        <option value="Instagram">Instagram</option>
                      </select>
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
                        {editLoading ? (
                          <span style={{ width:13,height:13,borderRadius:"50%",border:"2px solid rgb(255 255 255 / 0.30)",borderTopColor:"#fff",animation:"spin 0.7s linear infinite" }} aria-hidden="true" />
                        ) : <Check size={13} strokeWidth={2} />}
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

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          aside { transform: translateX(-100%); }
          main[role="main"] { margin-left: 0 !important; padding: 80px 16px 48px !important; }
        }
      `}</style>
    </div>
  );
}
