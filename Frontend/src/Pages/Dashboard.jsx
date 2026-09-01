import { useEffect, useState } from "react";
import { useLinks } from "../context/Linkcontext";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { motion, useReducedMotion } from "motion/react";
import {
  Bookmark, Plus, ExternalLink, User, Layers,
  Globe, LayoutDashboard, LogOut, AlertCircle, Tag
} from "lucide-react";
import "../styles/glass.css";
import "@fontsource-variable/geist";

// ─── Sidebar nav items ────────────────────────────────────────────────────
const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/profile",   icon: User,            label: "Profile"   },
  { to: "/categories",icon: Layers,          label: "Categories"},
];

// ─── Initials + color from URL ────────────────────────────────────────────
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
  try {
    const h = new URL(url).hostname;
    return DOMAIN_COLORS[h.charCodeAt(0) % DOMAIN_COLORS.length];
  } catch { return DOMAIN_COLORS[0]; }
}

export default function Dashboard() {
  const [linkText,        setLinkText]        = useState("");
  const [Customtag,       setCustomtag]       = useState("");
  const [selectedCategory,setSelectedCategory]= useState("Personal");
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");

  const { user, logout } = useAuth();
  const { fetchlinks, addlinks, links, loading: linksLoading, error: linksError } = useLinks();
  const location = useLocation();
  const reduce   = useReducedMotion();

  useEffect(() => { fetchlinks(); }, []);

  const handleEvent = async (e) => {
    e.preventDefault();
    const urlArray = linkText.split(/[\n, ]+/).map(u => u.trim()).filter(u => u.length > 0);
    if (urlArray.length === 0) { setError("Please provide at least one URL"); return; }
    setLoading(true);
    try {
      for (const singleUrl of urlArray) {
        const payload = Customtag
          ? { Linkdata: singleUrl, Customcat: Customtag }
          : { Linkdata: singleUrl, CategoriesbyDef: selectedCategory };
        await addlinks(payload);
      }
      setLinkText(""); setCustomtag(""); setSelectedCategory("Personal"); setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save links");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position:"relative", minHeight:"100dvh", display:"flex" }}>
      <div className="page-bg" aria-hidden="true" />

      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <aside
        className="glass-strong"
        style={{
          position:"fixed", top:0, left:0, bottom:0, width:260,
          zIndex:40, display:"flex", flexDirection:"column", padding:"20px 12px",
          borderRight:"1px solid var(--glass-border)", borderRadius:0,
          background:"rgb(10 10 14 / 0.72)",
          backdropFilter:"blur(32px) saturate(200%)",
          WebkitBackdropFilter:"blur(32px) saturate(200%)",
        }}
        role="navigation" aria-label="App navigation"
      >
        {/* Logo */}
        <Link to="/dashboard" style={{ display:"flex",alignItems:"center",gap:8,textDecoration:"none",marginBottom:28,paddingLeft:4 }}>
          <div className="nav-logo-mark">B</div>
          <span style={{ fontSize:17,fontWeight:700,letterSpacing:"-0.02em",color:"var(--text-primary)" }}>BMS</span>
        </Link>

        {/* Nav items */}
        <nav style={{ display:"flex",flexDirection:"column",gap:4,flex:1 }}>
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} style={{ textDecoration:"none" }}>
                <div
                  className={active ? "glass r-md" : "r-md"}
                  style={{
                    display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                    background: active ? "var(--glass-bg-default)" : "transparent",
                    borderRadius:"var(--r-md)",
                    transition:"background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)",
                    cursor:"pointer",
                  }}
                >
                  <Icon size={16} strokeWidth={active ? 2.2 : 1.75}
                    color={active ? "var(--accent)" : "var(--text-secondary)"} />
                  <span style={{ fontSize:14,fontWeight: active ? 600 : 500 }}>{label}</span>
                  {active && <div style={{ marginLeft:"auto",width:5,height:5,borderRadius:"50%",background:"var(--accent)" }} />}
                </div>
              </Link>
            );
          })}

          <a href={`/u/${user?.username}`} target="_blank" rel="noreferrer" style={{ textDecoration:"none" }}>
            <div className="r-md" style={{
              display:"flex",alignItems:"center",gap:10,padding:"10px 12px",
              color:"var(--text-secondary)",cursor:"pointer",borderRadius:"var(--r-md)",
              transition:"background var(--dur-base) var(--ease-out)",
            }}>
              <Globe size={16} strokeWidth={1.75} />
              <span style={{ fontSize:14,fontWeight:500 }}>Public Profile</span>
              <ExternalLink size={12} strokeWidth={1.75} style={{ marginLeft:"auto",opacity:0.5 }} />
            </div>
          </a>
        </nav>

        {/* User + logout */}
        <div style={{ borderTop:"1px solid var(--glass-border)",paddingTop:12 }}>
          <div className="glass-subtle r-md" style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 12px",marginBottom:8 }}>
            <div style={{
              width:32,height:32,borderRadius:"50%",background:"var(--accent-dim)",
              border:"1px solid rgb(255 49 98 / 0.28)",display:"flex",alignItems:"center",
              justifyContent:"center",flexShrink:0,fontSize:12,fontWeight:700,color:"var(--accent)"
            }}>
              {user?.username?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div style={{ minWidth:0,flex:1 }}>
              <p style={{ fontSize:13,fontWeight:600,color:"var(--text-primary)",lineHeight:1.2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                {user?.username}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="btn-ghost full"
            style={{ height:38,fontSize:13,gap:8,justifyContent:"center" }}
          >
            <LogOut size={14} strokeWidth={1.75} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <main
        role="main"
        style={{ flex:1, marginLeft:260, position:"relative", zIndex:1, padding:"32px 32px 64px" }}
      >
        {/* Page header */}
        <motion.div
          {...(reduce ? {} : { initial:{opacity:0,y:16}, animate:{opacity:1,y:0}, transition:{duration:0.5,ease:[0.16,1,0.3,1]} })}
          style={{ marginBottom:28 }}
        >
          <h1 style={{ fontSize:"clamp(22px,2.5vw,32px)",fontWeight:720,letterSpacing:"-0.025em",color:"var(--text-primary)",marginBottom:4 }}>
            Welcome back, <span style={{ color:"var(--accent)" }}>{user?.username}</span>
          </h1>
          <p style={{ fontSize:14,color:"var(--text-secondary)" }}>
            Add new bookmarks to your collection
          </p>
        </motion.div>

        {/* Add bookmarks form */}
        <motion.div
          {...(reduce ? {} : { initial:{opacity:0,y:20}, animate:{opacity:1,y:0}, transition:{duration:0.5,delay:0.08,ease:[0.16,1,0.3,1]} })}
          className="glass-strong r-xl"
          style={{ padding:"24px",marginBottom:28 }}
        >
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:20 }}>
            <div style={{
              width:32,height:32,borderRadius:"var(--r-md)",background:"var(--accent-dim)",
              border:"1px solid rgb(255 49 98 / 0.28)",display:"flex",alignItems:"center",
              justifyContent:"center",flexShrink:0,
            }}>
              <Plus size={16} color="var(--accent)" strokeWidth={2} />
            </div>
            <h2 style={{ fontSize:16,fontWeight:650,letterSpacing:"-0.015em",color:"var(--text-primary)" }}>
              Add Bookmarks
            </h2>
          </div>

          <form onSubmit={handleEvent} noValidate style={{ display:"flex",flexDirection:"column",gap:14 }}>
            {/* URL textarea */}
            <div className="field">
              <label htmlFor="linkText" className="field-label">URLs</label>
              <textarea
                id="linkText"
                className="input-glass"
                style={{ height:"auto",minHeight:100,paddingTop:12,paddingBottom:12,resize:"vertical",lineHeight:1.5 }}
                rows={4}
                value={linkText}
                onChange={(e) => { setLinkText(e.target.value); setError(""); }}
                placeholder="Paste one or multiple URLs (separated by newline, space, or comma)"
                required
                aria-required="true"
              />
            </div>

            {/* Category + custom tag row */}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
              <div className="field">
                <label htmlFor="category" className="field-label">Category</label>
                <div className="input-wrapper">
                  <span className="input-icon" aria-hidden="true">
                    <Layers size={15} strokeWidth={1.75} />
                  </span>
                  <select
                    id="category"
                    className="input-glass"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ paddingLeft:38,cursor:"pointer" }}
                  >
                    <option value="Personal">Personal</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Knowledge">Knowledge</option>
                    <option value="Instagram">Instagram</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="customtag" className="field-label">Custom Tag (optional)</label>
                <div className="input-wrapper">
                  <span className="input-icon" aria-hidden="true">
                    <Tag size={15} strokeWidth={1.75} />
                  </span>
                  <input
                    id="customtag"
                    type="text"
                    className="input-glass"
                    placeholder="e.g. React, Design..."
                    value={Customtag}
                    onChange={(e) => setCustomtag(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="error-banner" role="alert" aria-live="polite">
                <AlertCircle size={15} strokeWidth={2} style={{ flexShrink:0 }} />
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="btn-primary full" disabled={loading} aria-busy={loading} style={{ marginTop:4 }}>
              {loading ? (
                <>
                  <span style={{ width:14,height:14,borderRadius:"50%",border:"2px solid rgb(255 255 255 / 0.30)",borderTopColor:"#fff",animation:"spin 0.7s linear infinite",flexShrink:0 }} aria-hidden="true" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus size={15} strokeWidth={2} />
                  Save Bookmarks
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Links list */}
        <motion.div
          {...(reduce ? {} : { initial:{opacity:0,y:16}, animate:{opacity:1,y:0}, transition:{duration:0.5,delay:0.15,ease:[0.16,1,0.3,1]} })}
        >
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
            <h2 style={{ fontSize:15,fontWeight:650,color:"var(--text-primary)",letterSpacing:"-0.01em" }}>
              {linksLoading ? "Loading..." : `${links.length} Bookmark${links.length !== 1 ? "s" : ""}`}
            </h2>
            <Link to="/profile" style={{ textDecoration:"none" }}>
              <span className="badge" style={{ cursor:"pointer" }}>View all</span>
            </Link>
          </div>

          {linksError && (
            <div className="error-banner" role="alert" style={{ marginBottom:16 }}>
              <AlertCircle size={15} strokeWidth={2} style={{ flexShrink:0 }} />
              {linksError}
            </div>
          )}

          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {linksLoading ? (
              [0,1,2].map(i => (
                <div key={i} style={{ opacity: 1 - i * 0.25 }}>
                  <div className="glass-subtle r-md" style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 16px" }}>
                    <div style={{ width:36,height:36,borderRadius:8,background:"var(--glass-bg-default)",flexShrink:0 }} />
                    <div style={{ flex:1,display:"flex",flexDirection:"column",gap:6 }}>
                      <div style={{ height:12,borderRadius:4,background:"var(--glass-bg-default)",width:"55%" }} />
                      <div style={{ height:10,borderRadius:4,background:"var(--glass-bg-subtle)",width:"35%" }} />
                    </div>
                    <div style={{ width:60,height:20,borderRadius:999,background:"var(--glass-bg-default)" }} />
                  </div>
                </div>
              ))
            ) : links.length === 0 ? (
              <div className="glass r-lg" style={{ textAlign:"center",padding:"40px 24px" }}>
                <Bookmark size={28} color="var(--text-muted)" strokeWidth={1.5} style={{ margin:"0 auto 12px" }} />
                <p style={{ fontSize:14,color:"var(--text-secondary)",fontWeight:500,marginBottom:4 }}>No bookmarks yet</p>
                <p style={{ fontSize:13,color:"var(--text-muted)" }}>Paste URLs above to get started</p>
              </div>
            ) : (
              links.slice(0, 10).map((link, i) => (
                <motion.div
                  key={link._id}
                  {...(reduce ? {} : {
                    initial:{opacity:0,y:8},
                    animate:{opacity:1,y:0},
                    transition:{duration:0.35,delay:i*0.04,ease:[0.16,1,0.3,1]},
                  })}
                  className="glass-subtle r-md"
                  style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 14px" }}
                >
                  <div style={{
                    width:36,height:36,borderRadius:8,background:domainColor(link.Linkdata),
                    border:"1px solid var(--glass-border)",display:"flex",alignItems:"center",
                    justifyContent:"center",fontSize:11,fontWeight:700,color:"var(--text-secondary)",flexShrink:0,
                  }}>
                    {getInitials(link.Linkdata)}
                  </div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <p style={{ fontSize:13,fontWeight:600,color:"var(--text-primary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:1 }}>
                      {getDomain(link.Linkdata)}
                    </p>
                    <p style={{ fontSize:11,color:"var(--text-muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                      {link.Linkdata}
                    </p>
                  </div>
                  <span className="badge" style={{ flexShrink:0,fontSize:10 }}>
                    {link.CategoriesbyDef || link.customTagId?.Customcat}
                  </span>
                  <a href={link.Linkdata} target="_blank" rel="noreferrer" aria-label={`Open ${getDomain(link.Linkdata)}`}>
                    <button className="btn-icon" style={{ width:32,height:32 }} tabIndex={-1}>
                      <ExternalLink size={13} strokeWidth={1.75} />
                    </button>
                  </a>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
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
