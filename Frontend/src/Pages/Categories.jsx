import { useEffect } from "react";
import { useLinks } from "../context/Linkcontext";
import { motion, useReducedMotion } from "motion/react";
import { Layers, Tag, ExternalLink, AlertCircle } from "lucide-react";
import "../styles/glass.css";
import "@fontsource-variable/geist";
import Sidebar from "../components/Sidebar";

const PRESET_CATEGORIES = ["Personal","Entertainment","Knowledge","Instagram"];
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

function LinkRow({ link, reduce, i }) {
  return (
    <motion.div
      {...(reduce ? {} : { initial:{opacity:0,x:-8},animate:{opacity:1,x:0},transition:{duration:0.3,delay:i*0.04,ease:[0.16,1,0.3,1]} })}
      className="glass-subtle r-md"
      style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 12px" }}
    >
      <div style={{ width:28,height:28,borderRadius:6,background:domainColor(link.Linkdata),border:"1px solid var(--glass-border)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"var(--text-secondary)",flexShrink:0 }}>
        {getInitials(link.Linkdata)}
      </div>
      <div style={{ flex:1,minWidth:0 }}>
        <p style={{ fontSize:12,fontWeight:600,color:"var(--text-primary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{getDomain(link.Linkdata)}</p>
      </div>
      <a href={link.Linkdata} target="_blank" rel="noreferrer" aria-label={`Open ${getDomain(link.Linkdata)}`}>
        <button className="btn-icon" style={{ width:28,height:28 }} tabIndex={-1}>
          <ExternalLink size={11} strokeWidth={1.75} />
        </button>
      </a>
    </motion.div>
  );
}

export default function Categories() {
  const { links, customtags, loading, error, fetchlinks } = useLinks();
  const reduce = useReducedMotion();

  useEffect(() => { fetchlinks(); }, []);

  const groupedByCategory = PRESET_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = links.filter(l => l.CategoriesbyDef === cat);
    return acc;
  }, {});

  const groupedByTag = customtags.reduce((acc, tag) => {
    acc[tag.Customcat] = links.filter(l => l.customTagId?._id === tag._id);
    return acc;
  }, {});

  return (
    <div style={{ position:"relative",minHeight:"100dvh",display:"flex",overflowX:"hidden" }}>
      <div className="page-bg" aria-hidden="true" />
      <Sidebar />

      <main role="main" className="app-main" style={{ flex:1,minWidth:0,position:"relative",zIndex:1,padding:"32px 32px 64px" }}>
        <motion.div
          {...(reduce ? {} : { initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:0.5,ease:[0.16,1,0.3,1]} })}
          style={{ marginBottom:28 }}
        >
          <h1 style={{ fontSize:"clamp(22px,2.5vw,32px)",fontWeight:720,letterSpacing:"-0.025em",color:"var(--text-primary)",marginBottom:4 }}>
            Categories
          </h1>
          <p style={{ fontSize:14,color:"var(--text-secondary)" }}>
            Browse your bookmarks by category and custom tags
          </p>
        </motion.div>

        {error && (
          <div className="error-banner" role="alert" style={{ marginBottom:20 }}>
            <AlertCircle size={15} strokeWidth={2} style={{ flexShrink:0 }} />
            {error}
          </div>
        )}

        {/* Preset categories */}
        <div style={{ marginBottom:32 }}>
          <h2 style={{ fontSize:13,fontWeight:600,color:"var(--text-secondary)",letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:16 }}>
            Preset Categories
          </h2>
          <div className="categories-grid" style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14 }}>
            {PRESET_CATEGORIES.map((cat, ci) => (
              <motion.div
                key={cat}
                {...(reduce ? {} : { initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:0.45,delay:ci*0.07,ease:[0.16,1,0.3,1]} })}
                className="glass r-lg"
                style={{ padding:"18px 20px" }}
              >
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <div style={{ width:32,height:32,borderRadius:8,background:"var(--glass-bg-default)",border:"1px solid var(--glass-border)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                      <Layers size={15} strokeWidth={1.75} color="var(--accent)" />
                    </div>
                    <span style={{ fontSize:14,fontWeight:650,color:"var(--text-primary)" }}>{cat}</span>
                  </div>
                  <span className={groupedByCategory[cat]?.length > 0 ? "badge badge-accent" : "badge"}>
                    {loading ? "..." : groupedByCategory[cat]?.length ?? 0}
                  </span>
                </div>

                {loading ? (
                  <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                    {[0,1].map(i => (
                      <div key={i} className="glass-subtle r-md" style={{ height:40,opacity:1-i*0.4 }} />
                    ))}
                  </div>
                ) : groupedByCategory[cat]?.length === 0 ? (
                  <div style={{ textAlign:"center",padding:"12px 0" }}>
                    <p style={{ fontSize:12,color:"var(--text-muted)" }}>No links in {cat}</p>
                  </div>
                ) : (
                  <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                    {groupedByCategory[cat].slice(0,4).map((link, i) => (
                      <LinkRow key={link._id} link={link} reduce={reduce} i={i} />
                    ))}
                    {groupedByCategory[cat].length > 4 && (
                      <p style={{ fontSize:11,color:"var(--text-muted)",textAlign:"center",marginTop:4 }}>
                        +{groupedByCategory[cat].length - 4} more
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Custom tags */}
        <div>
          <h2 style={{ fontSize:13,fontWeight:600,color:"var(--text-secondary)",letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:16 }}>
            Custom Tags
          </h2>

          {!loading && customtags.length === 0 ? (
            <div className="glass r-lg" style={{ textAlign:"center",padding:"40px 24px" }}>
              <Tag size={28} color="var(--text-muted)" strokeWidth={1.5} style={{ margin:"0 auto 12px" }} />
              <p style={{ fontSize:14,color:"var(--text-secondary)",fontWeight:600,marginBottom:4 }}>No custom tags yet</p>
              <p style={{ fontSize:13,color:"var(--text-muted)" }}>Use the custom tag field on Dashboard when saving a bookmark</p>
            </div>
          ) : (
            <div className="categories-grid" style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14 }}>
              {customtags.map((tag, ti) => (
                <motion.div
                  key={tag._id}
                  {...(reduce ? {} : { initial:{opacity:0,y:14},animate:{opacity:1,y:0},transition:{duration:0.45,delay:ti*0.07,ease:[0.16,1,0.3,1]} })}
                  className="glass r-lg"
                  style={{ padding:"18px 20px" }}
                >
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                      <div style={{ width:32,height:32,borderRadius:8,background:"var(--accent-dim)",border:"1px solid rgb(255 49 98 / 0.28)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                        <Tag size={14} strokeWidth={1.75} color="var(--accent)" />
                      </div>
                      <span style={{ fontSize:14,fontWeight:650,color:"var(--text-primary)" }}>{tag.Customcat}</span>
                    </div>
                    <span className="badge badge-accent">
                      {groupedByTag[tag.Customcat]?.length ?? 0}
                    </span>
                  </div>
                  <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                    {(groupedByTag[tag.Customcat] ?? []).slice(0,4).map((link, i) => (
                      <LinkRow key={link._id} link={link} reduce={reduce} i={i} />
                    ))}
                    {(groupedByTag[tag.Customcat]?.length ?? 0) === 0 && (
                      <p style={{ fontSize:12,color:"var(--text-muted)",textAlign:"center",padding:"8px 0" }}>No links with this tag</p>
                    )}
                    {(groupedByTag[tag.Customcat]?.length ?? 0) > 4 && (
                      <p style={{ fontSize:11,color:"var(--text-muted)",textAlign:"center",marginTop:4 }}>
                        +{groupedByTag[tag.Customcat].length - 4} more
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
