import { getpubliclinks } from "../api/linkApi";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ExternalLink, Bookmark, AlertCircle, ArrowLeft, Globe } from "lucide-react";
import "../styles/glass.css";
import "@fontsource-variable/geist";

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

export default function Publicprofile() {
  const [link,    setLink]    = useState([]);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
  const reduce = useReducedMotion();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getpubliclinks(username);
        setLink(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load bookmarks");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  return (
    <div style={{ position:"relative",minHeight:"100dvh" }}>
      <div className="page-bg" aria-hidden="true" />

      {/* Nav */}
      <nav className="nav-glass" role="navigation" aria-label="Main navigation">
        <Link to="/" className="nav-logo">
          <div className="nav-logo-mark" aria-hidden="true">B</div>
          BMS
        </Link>
        <div className="nav-actions">
          <Globe size={14} strokeWidth={1.75} style={{ color:"var(--text-muted)" }} aria-hidden="true" />
          <span style={{ fontSize:13,color:"var(--text-secondary)" }}>Public profile</span>
          <Link to="/" className="btn-ghost" style={{ height:36,padding:"0 16px",fontSize:13,gap:6 }}>
            <ArrowLeft size={13} strokeWidth={2} />
            Home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div style={{ position:"relative",zIndex:1,maxWidth:1000,margin:"0 auto",padding:"clamp(88px,12vh,120px) 24px 64px" }}>
        {/* Header */}
        <motion.div
          {...(reduce ? {} : { initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:0.5,ease:[0.16,1,0.3,1]} })}
          style={{ marginBottom:36 }}
        >
          <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:10,flexWrap:"wrap" }}>
            <div style={{
              width:48,height:48,borderRadius:"50%",
              background:"linear-gradient(135deg,var(--accent) 0%,rgb(220 28 60 / 0.70) 100%)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:18,fontWeight:800,color:"#fff",flexShrink:0,
              boxShadow:"0 4px 16px rgb(255 49 98 / 0.30)",
            }}>
              {username?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div>
              <h1 style={{ fontSize:"clamp(22px,3vw,34px)",fontWeight:720,letterSpacing:"-0.025em",color:"var(--text-primary)",lineHeight:1.1 }}>
                {username}'s Bookmarks
              </h1>
            </div>
            {!loading && !error && (
              <span className="badge badge-accent" style={{ marginLeft:"auto" }}>
                {link.length} saved
              </span>
            )}
          </div>
          <hr className="divider" />
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            {...(reduce ? {} : { initial:{opacity:0,scale:0.96},animate:{opacity:1,scale:1},transition:{duration:0.35,ease:[0.16,1,0.3,1]} })}
            className="glass-strong r-xl"
            style={{ textAlign:"center",padding:"48px 24px" }}
          >
            <AlertCircle size={32} color="rgb(255 49 98 / 0.70)" strokeWidth={1.5} style={{ margin:"0 auto 14px" }} />
            <p style={{ fontSize:15,fontWeight:600,color:"var(--text-primary)",marginBottom:6 }}>Could not load bookmarks</p>
            <p style={{ fontSize:13,color:"var(--text-secondary)" }}>{error}</p>
          </motion.div>
        )}

        {/* Skeleton loading */}
        {loading && !error && (
          <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12 }}>
            {[0,1,2,3,4,5].map(i => (
              <div key={i} className="glass r-lg" style={{ padding:"16px",opacity:1-i*0.12 }}>
                <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ width:40,height:40,borderRadius:10,background:"var(--glass-bg-default)",flexShrink:0 }} />
                  <div style={{ flex:1,display:"flex",flexDirection:"column",gap:7 }}>
                    <div style={{ height:12,borderRadius:4,background:"var(--glass-bg-default)",width:"50%" }} />
                    <div style={{ height:10,borderRadius:4,background:"var(--glass-bg-subtle)",width:"70%" }} />
                  </div>
                  <div style={{ width:60,height:20,borderRadius:999,background:"var(--glass-bg-default)" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && link.length === 0 && (
          <motion.div
            {...(reduce ? {} : { initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:0.45,ease:[0.16,1,0.3,1]} })}
            className="glass r-xl"
            style={{ textAlign:"center",padding:"56px 24px" }}
          >
            <Bookmark size={36} color="var(--text-muted)" strokeWidth={1.25} style={{ margin:"0 auto 16px" }} />
            <p style={{ fontSize:16,fontWeight:600,color:"var(--text-secondary)",marginBottom:6 }}>
              No public bookmarks yet
            </p>
            <p style={{ fontSize:13,color:"var(--text-muted)" }}>
              {username} hasn't saved any bookmarks publicly
            </p>
          </motion.div>
        )}

        {/* Bookmark grid */}
        {!loading && !error && link.length > 0 && (
          <motion.div
            {...(reduce ? {} : { initial:{opacity:0},animate:{opacity:1},transition:{duration:0.4,ease:[0.16,1,0.3,1]} })}
            style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12 }}
          >
            {link.map((item, i) => (
              <motion.div
                key={item._id}
                {...(reduce ? {} : {
                  initial:{opacity:0,y:12},
                  animate:{opacity:1,y:0},
                  transition:{duration:0.35,delay:i*0.04,ease:[0.16,1,0.3,1]},
                })}
                className="glass r-lg"
                style={{ padding:"14px 16px",display:"flex",alignItems:"center",gap:12 }}
              >
                <div style={{
                  width:40,height:40,borderRadius:10,background:domainColor(item.Linkdata),
                  border:"1px solid var(--glass-border)",display:"flex",alignItems:"center",
                  justifyContent:"center",fontSize:12,fontWeight:700,color:"var(--text-secondary)",flexShrink:0,
                }}>
                  {getInitials(item.Linkdata)}
                </div>
                <div style={{ flex:1,minWidth:0 }}>
                  <p style={{ fontSize:13,fontWeight:600,color:"var(--text-primary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2 }}>
                    {getDomain(item.Linkdata)}
                  </p>
                  <p style={{ fontSize:11,color:"var(--text-muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                    {item.Linkdata}
                  </p>
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:6,flexShrink:0 }}>
                  {item.CategoriesbyDef && (
                    <span className="badge" style={{ fontSize:10 }}>{item.CategoriesbyDef}</span>
                  )}
                  <a href={item.Linkdata} target="_blank" rel="noreferrer" aria-label={`Open ${getDomain(item.Linkdata)}`}>
                    <button className="btn-icon" style={{ width:32,height:32 }} tabIndex={-1}>
                      <ExternalLink size={13} strokeWidth={1.75} />
                    </button>
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          div[style*="grid-template-columns: repeat(2"] {
            grid-template-columns: 1fr !important;
          }
          .nav-glass { padding: 0 16px; }
        }
      `}</style>
    </div>
  );
}
