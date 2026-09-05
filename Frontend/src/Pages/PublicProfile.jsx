import { getpubliclinks } from "../api/linkApi";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ExternalLink, Bookmark, AlertCircle, ArrowLeft, Globe } from "lucide-react";
import "../styles/glass.css";
import "@fontsource-variable/geist";

const DOMAIN_COLORS = ["#1a1a2e", "#1a0d0d", "#0d0d1a", "#0d1a16", "#1a160d", "#101a1a"];

function getInitials(url) {
  try { return new URL(url).hostname.replace("www.", "").slice(0, 2).toUpperCase(); }
  catch { return "??"; }
}
function getDomain(url) {
  try { return new URL(url).hostname.replace("www.", ""); }
  catch { return url; }
}
function domainColor(url) {
  try { const h = new URL(url).hostname; return DOMAIN_COLORS[h.charCodeAt(0) % DOMAIN_COLORS.length]; }
  catch { return DOMAIN_COLORS[0]; }
}

// ─── Skeleton card ────────────────────────────────────────────────────────
function SkeletonCard({ opacity }) {
  return (
    <div className="glass r-lg" style={{ padding: "14px 16px", opacity }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--glass-bg-default)", flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 7 }}>
          <div style={{ height: 12, borderRadius: 4, background: "var(--glass-bg-default)", width: "40%" }} />
          <div style={{ height: 10, borderRadius: 4, background: "var(--glass-bg-subtle)", width: "65%" }} />
        </div>
        <div style={{ width: 80, height: 22, borderRadius: 999, background: "var(--glass-bg-default)", flexShrink: 0 }} />
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--glass-bg-default)", flexShrink: 0 }} />
      </div>
    </div>
  );
}

export default function Publicprofile() {
  const [link,        setLink]        = useState([]);
  const [error,       setError]       = useState("");
  const [loading,     setLoading]     = useState(true);
  const [totalItems,  setTotalItems]  = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);

  const { username } = useParams();
  const reduce = useReducedMotion();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getpubliclinks(username, currentPage, 10);
        setLink(res.data.data.Publicbookmarks);
        setTotalItems(res.data.data.totalItems);
        setTotalPages(res.data.data.totalPages);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load bookmarks");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username, currentPage]);

  // ── Pagination helpers ────────────────────────────────────────────────
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
    .reduce((acc, p, idx, arr) => {
      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);

  return (
    <div style={{ position: "relative", minHeight: "100dvh", overflowX: "hidden" }}>
      <div className="page-bg" aria-hidden="true" />

      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <nav className="nav-glass public-nav-glass" role="navigation" aria-label="Main navigation">
        <Link to="/" className="nav-logo">
          <div className="nav-logo-mark" aria-hidden="true">B</div>
          BMS
        </Link>
        <div className="nav-actions">
          <Globe size={14} strokeWidth={1.75} style={{ color: "var(--text-muted)" }} aria-hidden="true" />
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Public profile</span>
          <Link to="/" className="btn-ghost" style={{ height: 36, padding: "0 16px", fontSize: 13, gap: 6 }}>
            <ArrowLeft size={13} strokeWidth={2} />
            Home
          </Link>
        </div>
      </nav>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: 860,
        margin: "0 auto",
        padding: "clamp(88px, 12vh, 120px) clamp(16px, 3vw, 32px) 80px",
        boxSizing: "border-box",
      }}>

        {/* ── Profile header ───────────────────────────────────────── */}
        <motion.div
          {...(reduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } })}
          style={{ marginBottom: 32 }}
        >
          <div className="profile-header-row" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
            {/* Avatar */}
            <div style={{
              width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, var(--accent) 0%, rgb(220 28 60 / 0.70) 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 800, color: "#fff",
              boxShadow: "0 4px 20px rgb(255 49 98 / 0.28)",
            }}>
              {username?.[0]?.toUpperCase() ?? "U"}
            </div>

            {/* Name + count */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{
                fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 720,
                letterSpacing: "-0.025em", color: "var(--text-primary)", lineHeight: 1.15,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {username}'s Bookmarks
              </h1>
            </div>

            {!loading && !error && (
              <span className="badge badge-accent" style={{ flexShrink: 0 }}>
                {totalItems} saved
              </span>
            )}
          </div>
          <hr className="divider" />
        </motion.div>

        {/* ── Error ────────────────────────────────────────────────── */}
        {error && (
          <motion.div
            {...(reduce ? {} : { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } })}
            className="glass-strong r-xl"
            style={{ textAlign: "center", padding: "48px 24px" }}
          >
            <AlertCircle size={32} color="rgb(255 49 98 / 0.70)" strokeWidth={1.5} style={{ margin: "0 auto 14px" }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
              Could not load bookmarks
            </p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{error}</p>
          </motion.div>
        )}

        {/* ── Skeleton ─────────────────────────────────────────────── */}
        {loading && !error && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[1, 0.85, 0.7, 0.55, 0.4, 0.28].map((op, i) => (
              <SkeletonCard key={i} opacity={op} />
            ))}
          </div>
        )}

        {/* ── Empty ────────────────────────────────────────────────── */}
        {!loading && !error && link.length === 0 && (
          <motion.div
            {...(reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } })}
            className="glass r-xl"
            style={{ textAlign: "center", padding: "56px 24px" }}
          >
            <Bookmark size={36} color="var(--text-muted)" strokeWidth={1.25} style={{ margin: "0 auto 16px" }} />
            <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
              No public bookmarks yet
            </p>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {username} hasn't saved any bookmarks publicly
            </p>
          </motion.div>
        )}

        {/* ── Bookmark list ─────────────────────────────────────────── */}
        {!loading && !error && link.length > 0 && (
          <motion.div
            {...(reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } })}
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            {link.map((item, i) => (
              <motion.div
                key={item._id}
                {...(reduce ? {} : {
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.3, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] },
                })}
                className="glass r-lg"
                style={{
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  boxSizing: "border-box",
                  overflow: "hidden",
                }}
              >
                {/* Favicon avatar */}
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: domainColor(item.Linkdata),
                  border: "1px solid var(--glass-border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, color: "var(--text-secondary)",
                }}>
                  {getInitials(item.Linkdata)}
                </div>

                {/* Domain + URL */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 13, fontWeight: 600, color: "var(--text-primary)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    marginBottom: 2,
                  }}>
                    {getDomain(item.Linkdata)}
                  </p>
                  <p style={{
                    fontSize: 11, color: "var(--text-muted)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {item.Linkdata}
                  </p>
                </div>

                {/* Category badge + open button */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  {(item.CategoriesbyDef || item.customTagId?.Customcat) && (
                    <span className="badge" style={{ fontSize: 10 }}>
                      {item.CategoriesbyDef || item.customTagId?.Customcat}
                    </span>
                  )}
                  <a
                    href={item.Linkdata}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${getDomain(item.Linkdata)}`}
                  >
                    <button className="btn-icon" style={{ width: 32, height: 32 }} tabIndex={-1}>
                      <ExternalLink size={13} strokeWidth={1.75} />
                    </button>
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── Pagination ───────────────────────────────────────────── */}
        {!loading && !error && totalPages > 1 && (
          <motion.div
            {...(reduce ? {} : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] } })}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 36, flexWrap: "wrap" }}
          >
            <button
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
              className="btn-ghost"
              style={{ height: 38, padding: "0 16px", fontSize: 13, gap: 6, opacity: currentPage === 1 ? 0.38 : 1 }}
            >
              <ArrowLeft size={13} strokeWidth={2} />
              Prev
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              {pages.map((p, idx) =>
                p === "..." ? (
                  <span key={`dots-${idx}`} style={{ fontSize: 13, color: "var(--text-muted)", padding: "0 4px", userSelect: "none" }}>
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={p === currentPage ? "btn-primary" : "btn-ghost"}
                    style={{
                      width: 36, height: 36, padding: 0, fontSize: 13,
                      fontWeight: p === currentPage ? 700 : 500,
                    }}
                  >
                    {p}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
              className="btn-ghost"
              style={{ height: 38, padding: "0 16px", fontSize: 13, gap: 6, opacity: currentPage === totalPages ? 0.38 : 1 }}
            >
              Next
              <ArrowLeft size={13} strokeWidth={2} style={{ transform: "rotate(180deg)" }} />
            </button>
          </motion.div>
        )}

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
