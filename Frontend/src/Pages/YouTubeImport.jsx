import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectYoutube, getYouTubeStatus, getYouTubePlaylists, revokeYouTube, youtubePreview, youtubeConfirm } from "../api/importApi";
import { useLinks } from "../context/Linkcontext";
import { motion, useReducedMotion } from "motion/react";
import { PlaySquare, ArrowRight, CheckCircle2, AlertCircle, Check, SkipForward, LayoutDashboard, Unlink, Link2, Play, List } from "lucide-react";
import "../styles/glass.css";
import "@fontsource-variable/geist";
import Sidebar from "../components/Sidebar";

export default function YouTubeImportPage() {
  const [statusLoading, setStatusLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [isconnected, setIsConnected] = useState(false);
  const [playlistID, setPlaylistID] = useState("");
  const [preview, setPreview] = useState([]);
  const [importedResults, setImportedResults] = useState(null);
  const [error, setError] = useState("");
  const [selectedIndexes, setSelectedIndexes] = useState(new Set());
  const [playlist, setPlaylist] = useState([]);
  const [showPlaylistPicker, setShowPlaylistPicker] = useState(false);

  const navigate = useNavigate();
  const { fetchlinks } = useLinks();
  const reduce = useReducedMotion();

  useEffect(() => {
    const checkStatus = async () => {
      setStatusLoading(true);
      try {
        const res = await getYouTubeStatus();
        setIsConnected(res.data.data.connected);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to get YouTube authentication status");
      } finally {
        setStatusLoading(false);
      }
    };
    checkStatus();
  }, []);

  const HandleConnect = () => {
    connectYoutube();
  };

  const HandleRevoke = async () => {
    setStatusLoading(true);
    try {
      await revokeYouTube();
      setPlaylistID("");
      setPreview([]);
      setPlaylist([]);
      setShowPlaylistPicker(false);
      setIsConnected(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to revoke YouTube access");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleGetPlaylists = async () => {
    setPreviewLoading(true);
    setError("");
    try {
      const res = await getYouTubePlaylists();
      setPlaylist(res.data.data);
      setShowPlaylistPicker(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch playlists");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handlePreview = async (type, id) => {
    setPreviewLoading(true);
    setError("");
    try {
      const res = await youtubePreview(type, id || playlistID);
      setPreview(res.data.data.preview);
    } catch (err) {
      setError(err.response?.data?.message || "YouTube preview failed");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handlePlaylistSelect = (id) => {
    setPlaylistID(id);
    setShowPlaylistPicker(false);
     handlePreview("playlist", id);
  };

  const handleToggleSelect = (index) => {
    setSelectedIndexes((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIndexes.size === preview.length) {
      setSelectedIndexes(new Set());
    } else {
      setSelectedIndexes(new Set(preview.map((_, i) => i)));
    }
  };

  const handleDeleteRow = (index) => {
    setPreview((prev) => prev.filter((_, i) => i !== index));
    setSelectedIndexes((prev) => {
      const next = new Set();
      prev.forEach((i) => {
        if (i < index) next.add(i);
        else if (i > index) next.add(i - 1);
      });
      return next;
    });
  };

  const handleconfirm = async () => {
    if (preview.length === 0) {
      setError("No videos to import");
      return;
    }
    setImportLoading(true);
    setError("");
    try {
      const toImport = selectedIndexes.size > 0 ? preview.filter((_, i) => selectedIndexes.has(i)) : preview;
      const res = await youtubeConfirm(toImport);
      setImportedResults(res.data.data);
      fetchlinks();
    } catch (err) {
      setError(err.response?.data?.message || "Import of videos failed");
    } finally {
      setImportLoading(false);
    }
  };

  const step = importedResults ? 3 : preview.length > 0 ? 2 : 1;

  return (
    <div style={{ position: "relative", minHeight: "100dvh", display: "flex", overflowX: "hidden" }}>
      <div className="page-bg" aria-hidden="true" />
      <Sidebar />

      <main role="main" className="app-main" style={{ flex: 1, minWidth: 0, position: "relative", zIndex: 1, padding: "32px 32px 64px" }}>
        {/* ── Header ─────────────────────────────────────────────────── */}
        <motion.div {...(reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } })} style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 720, letterSpacing: "-0.025em", color: "var(--text-primary)", marginBottom: 4 }}>Import from YouTube</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Connect your YouTube account to import liked videos or playlist items</p>
        </motion.div>

        {/* ── Step indicator ──────────────────────────────────────────── */}
        <motion.div {...(reduce ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] } })} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
          {[
            { n: 1, label: "Connect" },
            { n: 2, label: "Review" },
            { n: 3, label: "Done" },
          ].map(({ n, label }, i) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "5px 12px 5px 8px",
                  borderRadius: 999,
                  background: step === n ? "var(--accent-dim)" : step > n ? "rgb(48 209 88 / 0.10)" : "var(--glass-bg-subtle)",
                  border: `1px solid ${step === n ? "rgb(255 49 98 / 0.30)" : step > n ? "rgb(48 209 88 / 0.28)" : "var(--glass-border)"}`,
                }}>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: step === n ? "var(--accent)" : step > n ? "#30d158" : "var(--glass-bg-default)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: step >= n ? "#fff" : "var(--text-muted)",
                  }}>
                  {step > n ? <Check size={10} strokeWidth={3} /> : n}
                </div>
                <span className="step-label" style={{ fontSize: 12, fontWeight: 600, color: step === n ? "var(--accent)" : step > n ? "#30d158" : "var(--text-muted)" }}>
                  {label}
                </span>
              </div>
              {i < 2 && <div style={{ width: 24, height: 1, background: "var(--glass-border)" }} />}
            </div>
          ))}
        </motion.div>

        {/* ── Error banner ────────────────────────────────────────────── */}
        {error && (
          <motion.div role="alert" aria-live="polite" className="error-banner" {...(reduce ? {} : { initial: { opacity: 0, y: -6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25 } })} style={{ marginBottom: 20 }}>
            <AlertCircle size={15} strokeWidth={2} style={{ flexShrink: 0 }} />
            {error}
          </motion.div>
        )}

        {/* ── STEP 1 — Connect / disconnect ───────────────────────────── */}
        {!importedResults && (
          <motion.div {...(reduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] } })} className="glass-strong r-xl" style={{ padding: 24, marginBottom: 24 }}>
            {/* Card header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "var(--r-md)",
                  background: "var(--accent-dim)",
                  border: "1px solid rgb(255 49 98 / 0.28)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                <PlaySquare size={15} color="var(--accent)" strokeWidth={2} />
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 650, letterSpacing: "-0.015em", color: "var(--text-primary)" }}>YouTube Account</h2>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 999,
                  background: isconnected ? "rgb(48 209 88 / 0.10)" : "var(--glass-bg-subtle)",
                  border: `1px solid ${isconnected ? "rgb(48 209 88 / 0.28)" : "var(--glass-border)"}`,
                  color: isconnected ? "#30d158" : "var(--text-muted)",
                }}>
                {statusLoading ? "Checking..." : isconnected ? "Connected" : "Not connected"}
              </span>
            </div>

            {!isconnected ? (
              <button onClick={HandleConnect} disabled={statusLoading} className="btn-primary full" style={{ height: 48, gap: 8, color: "#fff" }} aria-busy={statusLoading}>
                <Link2 size={15} strokeWidth={2} />
                Connect YouTube Account
              </button>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Liked videos */}
                <button onClick={() => handlePreview("liked")} disabled={previewLoading} className="btn-primary full" style={{ height: 48, gap: 8, color: "#fff" }} aria-busy={previewLoading}>
                  {previewLoading ? (
                    <>
                      <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: "50%", border: "2px solid rgb(255 255 255 / 0.30)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite", flexShrink: 0 }} aria-hidden="true" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Play size={15} strokeWidth={2} />
                      Import Liked Videos
                    </>
                  )}
                </button>

                {/* Import from Playlist */}
                <button onClick={handleGetPlaylists} disabled={previewLoading} className="btn-ghost full" style={{ height: 48, gap: 8 }}>
                  {previewLoading ? (
                    <>
                      <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: "50%", border: "2px solid rgb(255 255 255 / 0.30)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite", flexShrink: 0 }} aria-hidden="true" />
                      Loading playlists...
                    </>
                  ) : (
                    <>
                      <List size={15} strokeWidth={2} />
                      Browse Playlists
                    </>
                  )}
                </button>

                {/* Playlist picker */}
                {showPlaylistPicker && playlist.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10, marginTop: 4 }}>
                    {playlist.map((p) => (
                      <button
                        key={p.playlistId}
                        onClick={() => handlePlaylistSelect(p.playlistId)}
                        style={{
                          background: "var(--glass-bg-subtle)",
                          border: "1px solid var(--glass-border)",
                          borderRadius: "var(--r-md)",
                          padding: 0,
                          cursor: "pointer",
                          overflow: "hidden",
                          textAlign: "left",
                          transition: "border-color 150ms ease, background 150ms ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "rgb(255 49 98 / 0.40)";
                          e.currentTarget.style.background = "var(--accent-dim)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "var(--glass-border)";
                          e.currentTarget.style.background = "var(--glass-bg-subtle)";
                        }}>
                        {p.thumbnailUrl ? (
                          <img src={p.thumbnailUrl} alt={p.title} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
                        ) : (
                          <div style={{ width: "100%", aspectRatio: "16/9", background: "var(--glass-bg-default)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <PlaySquare size={20} color="var(--text-muted)" strokeWidth={1.5} />
                          </div>
                        )}
                        <div style={{ padding: "8px 10px" }}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 2 }}>{p.title}</p>
                          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.itemCount} videos</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {showPlaylistPicker && playlist.length === 0 && <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "16px 0" }}>No playlists found on your account.</p>}

                {/* Revoke */}
                <button
                  onClick={HandleRevoke}
                  disabled={statusLoading}
                  style={{
                    height: 36,
                    padding: "0 14px",
                    fontSize: 12,
                    borderRadius: 8,
                    background: "transparent",
                    border: "1px solid rgb(255 49 98 / 0.25)",
                    color: "rgb(255 49 98 / 0.70)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    transition: "all 150ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgb(255 49 98 / 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}>
                  <Unlink size={12} strokeWidth={2} />
                  Disconnect YouTube
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* ── STEP 2 — Preview table ───────────────────────────────────── */}
        {preview.length > 0 && !importedResults && (
          <motion.div {...(reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] } })}>
            {/* Section header */}
            <div className="glass r-lg" style={{ padding: "16px 20px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 650, color: "var(--text-primary)", marginBottom: 2 }}>
                  Found <span style={{ color: "var(--accent)" }}>{preview.length}</span> videos
                  {selectedIndexes.size > 0 && <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: 13, marginLeft: 8 }}>· {selectedIndexes.size} selected</span>}
                </h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Review before importing</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <button onClick={handleSelectAll} className="btn-ghost" style={{ height: 36, padding: "0 14px", fontSize: 12 }}>
                  {selectedIndexes.size === preview.length ? "Deselect All" : "Select All"}
                </button>
                <button onClick={handleconfirm} disabled={importLoading} className="btn-primary" style={{ height: 42, gap: 8, padding: "0 20px", color: "#fff" }} aria-busy={importLoading}>
                  {importLoading ? (
                    <>
                      <span style={{ display: "inline-block", width: 13, height: 13, borderRadius: "50%", border: "2px solid rgb(255 255 255 / 0.30)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite", flexShrink: 0 }} aria-hidden="true" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <ArrowRight size={14} strokeWidth={2} />
                      Import {selectedIndexes.size > 0 ? selectedIndexes.size : preview.length}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Video rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {preview.map((video, index) => (
                <motion.div key={index} {...(reduce ? {} : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] } })} className="glass-subtle r-md" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", flexWrap: "wrap" }}>
                  {/* Checkbox */}
                  <input type="checkbox" checked={selectedIndexes.has(index)} onChange={() => handleToggleSelect(index)} style={{ width: 16, height: 16, flexShrink: 0, cursor: "pointer", accentColor: "var(--accent)" }} />

                  {/* Thumbnail */}
                  {video.thumbnailUrl ? (
                    <img src={video.thumbnailUrl} alt={video.title} style={{ width: 56, height: 34, borderRadius: 6, objectFit: "cover", flexShrink: 0, border: "1px solid var(--glass-border)" }} />
                  ) : (
                    <div
                      style={{
                        width: 56,
                        height: 34,
                        borderRadius: 6,
                        flexShrink: 0,
                        background: "var(--glass-bg-default)",
                        border: "1px solid var(--glass-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                      <PlaySquare size={14} color="var(--text-muted)" strokeWidth={1.5} />
                    </div>
                  )}

                  {/* Title + URL */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 1 }}>{video.title || "Untitled video"}</p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{video.url}</p>
                    <p style={{ fontSize: 11, color: "var(--text-secondary)" }}>{video.channelTitle}</p>
                  </div>

                  {/* Category badge */}
                  {video.category && (
                    <span className="badge" style={{ fontSize: 10, flexShrink: 0 }}>
                      {video.category}
                    </span>
                  )}

                  {/* Delete row */}
                  <button
                    onClick={() => handleDeleteRow(index)}
                    title="Remove from import"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      flexShrink: 0,
                      background: "transparent",
                      border: "1px solid var(--glass-border)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-muted)",
                      transition: "all 150ms ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgb(255 49 98 / 0.12)";
                      e.currentTarget.style.borderColor = "rgb(255 49 98 / 0.30)";
                      e.currentTarget.style.color = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "var(--glass-border)";
                      e.currentTarget.style.color = "var(--text-muted)";
                    }}>
                    ✕
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Bottom CTA */}
            <button onClick={handleconfirm} disabled={importLoading} className="btn-primary full" style={{ marginTop: 20, height: 48, gap: 8, color: "#fff" }} aria-busy={importLoading}>
              {importLoading ? (
                <>
                  <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: "50%", border: "2px solid rgb(255 255 255 / 0.30)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite", flexShrink: 0 }} aria-hidden="true" />
                  Importing...
                </>
              ) : (
                <>
                  <ArrowRight size={15} strokeWidth={2} />
                  Import {selectedIndexes.size > 0 ? selectedIndexes.size : preview.length} Videos
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* ── STEP 3 — Success ─────────────────────────────────────────── */}
        {importedResults && (
          <motion.div {...(reduce ? {} : { initial: { opacity: 0, scale: 0.96, y: 16 }, animate: { opacity: 1, scale: 1, y: 0 }, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } })} className="glass-strong r-xl" style={{ padding: "clamp(32px,5vw,48px)", textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
            <motion.div {...(reduce ? {} : { initial: { scale: 0.6, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] } })} style={{ marginBottom: 20 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgb(48 209 88 / 0.12)",
                  border: "1px solid rgb(48 209 88 / 0.28)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  boxShadow: "0 4px 24px rgb(48 209 88 / 0.18)",
                }}
                aria-hidden="true">
                <CheckCircle2 size={30} color="#30d158" strokeWidth={1.5} />
              </div>
            </motion.div>

            <h2 style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 720, letterSpacing: "-0.02em", color: "var(--text-primary)", marginBottom: 8 }}>Import Complete</h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 28 }}>Your YouTube videos have been imported successfully.</p>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 28, flexWrap: "wrap" }}>
              <div className="glass r-lg" style={{ padding: "14px 28px", minWidth: 120 }}>
                <p style={{ fontSize: 32, fontWeight: 760, letterSpacing: "-0.04em", color: "var(--accent)", lineHeight: 1, marginBottom: 4 }}>{importedResults.inserted}</p>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>Imported</p>
              </div>
              <div className="glass r-lg" style={{ padding: "14px 28px", minWidth: 120 }}>
                <p style={{ fontSize: 32, fontWeight: 760, letterSpacing: "-0.04em", color: "var(--text-secondary)", lineHeight: 1, marginBottom: 4 }}>{importedResults.skipped}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                  <SkipForward size={10} strokeWidth={2} color="var(--text-muted)" />
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>Skipped</p>
                </div>
              </div>
            </div>

            <hr className="divider" style={{ marginBottom: 24 }} />

            <button className="btn-primary full" onClick={() => navigate("/dashboard")} style={{ height: 48, gap: 8, color: "#fff" }}>
              <LayoutDashboard size={15} strokeWidth={2} />
              Go to Dashboard
            </button>
          </motion.div>
        )}
      </main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
