import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { chromePreview, chromeConfirm } from "../api/importApi";
import { useLinks } from "../context/Linkcontext";
import { useAuth } from "../context/Authcontext";
import { motion, useReducedMotion } from "motion/react";
import { Upload, FileText, ArrowRight, CheckCircle2, AlertCircle, Check} from "lucide-react";
import "../styles/glass.css";
import "@fontsource-variable/geist";
import GlassSelect from "../components/GlassSelect";
import Sidebar from "../components/Sidebar";

// ─── Constants ────────────────────────────────────────────────────────────
const PRESET_CATEGORIES = ["Personal", "Entertainment", "Knowledge", "Instagram"];

// ─── Domain helpers ────────────────────────────────────────────────────────
const DOMAIN_COLORS = ["#1a1a2e", "#1a0d0d", "#0d0d1a", "#0d1a16", "#1a160d", "#101a1a"];
function getInitials(url) {
  try {
    return new URL(url).hostname.replace("www.", "").slice(0, 2).toUpperCase();
  } catch {
    return "??";
  }
}
function getDomain(url) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}
function domainColor(url) {
  try {
    const h = new URL(url).hostname;
    return DOMAIN_COLORS[h.charCodeAt(0) % DOMAIN_COLORS.length];
  } catch {
    return DOMAIN_COLORS[0];
  }
}

// ─── Main component ────────────────────────────────────────────────────────
export default function ImportPage() {
  const [importedfile, setImportedfile] = useState(null);
  const [editableLinks, setEditableLinks] = useState([]);
  const [selectedIndexes, setSelectedIndexes] = useState(new Set()); // for select/deselect
  const [loading, setLoading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { fetchlinks } = useLinks();
  const reduce         = useReducedMotion();

  // ── Original logic — untouched ────────────────────────────────────────
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportedfile(e.target.files[0]);
      setError("");
      setEditableLinks([]);
      setImportResult(null);
    }
  };

  const handlepreview = async () => {
    if (importedfile == null) {
      setError("Please select a file first");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await chromePreview(importedfile);
      setEditableLinks(res.data.data.preview);
    } catch (err) {
      setError(err.response?.data.message || "failed to analyze file");
    } finally {
      setLoading(false);
    }
  };

  const handlecategorychange = (index, newValue) => {
    setEditableLinks((prev) =>
      prev.map((link, i) => {
        if (i !== index) return link;
        if (PRESET_CATEGORIES.includes(newValue)) {
          return { ...link, category: newValue, customTag: null };
        }
        return { ...link, customTag: newValue, category: null };
      }),
    );
  };

  // ── Delete a single row from preview ─────────────────────────────────
  const handleDeleteRow = (index) => {
    setEditableLinks((prev) => prev.filter((_, i) => i !== index));
    // also remove from selected indexes, adjust higher indexes down by 1
    setSelectedIndexes((prev) => {
      const next = new Set();
      prev.forEach((i) => {
        if (i < index) next.add(i);
        else if (i > index) next.add(i - 1);
      });
      return next;
    });
  };

  // ── Toggle selection of a single row ─────────────────────────────────
  const handleToggleSelect = (index) => {
    setSelectedIndexes((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  // ── Select all / deselect all ─────────────────────────────────────────
  const handleSelectAll = () => {
    if (selectedIndexes.size === editableLinks.length) {
      setSelectedIndexes(new Set()); // all selected → deselect all
    } else {
      setSelectedIndexes(new Set(editableLinks.map((_, i) => i))); // select all
    }
  };

  // ── Delete all selected rows ──────────────────────────────────────────
  const handleDeleteSelected = () => {
    setEditableLinks((prev) => prev.filter((_, i) => !selectedIndexes.has(i)));
    setSelectedIndexes(new Set());
  };

  const handleconfirm = async () => {
    if (editableLinks.length === 0) {
      setError("No links to import");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // if user has selected specific rows — import only those, else import all
      const toImport = selectedIndexes.size > 0 ? editableLinks.filter((_, i) => selectedIndexes.has(i)) : editableLinks;
      const res = await chromeConfirm(toImport);
      setImportResult(res.data.data);
      fetchlinks();
    } catch (err) {
      setError(err.response?.data?.message || "import failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Step derived from state ───────────────────────────────────────────
  const step = importResult ? 3 : editableLinks.length > 0 ? 2 : 1;

  return (
    <div style={{ position: "relative", minHeight: "100dvh", display: "flex" }}>
      <div className="page-bg" aria-hidden="true" />

      <Sidebar />

      {/* ── Main content ──────────────────────────────────────────────── */}
      <main role="main" style={{ flex: 1, minWidth: 0, position: "relative", zIndex: 1, padding: "32px 32px 64px" }}>
        {/* Page header */}
        <motion.div {...(reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } })} style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 720, letterSpacing: "-0.025em", color: "var(--text-primary)", marginBottom: 4 }}>Import Bookmarks</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Upload your Chrome bookmarks HTML file and review before importing</p>
        </motion.div>

        {/* Step indicator */}
        <motion.div {...(reduce ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] } })} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
          {[
            { n: 1, label: "Upload file" },
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
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: step === n ? "var(--accent)" : step > n ? "#30d158" : "var(--text-muted)",
                  }}>
                  {label}
                </span>
              </div>
              {i < 2 && <div style={{ width: 24, height: 1, background: "var(--glass-border)" }} />}
            </div>
          ))}
        </motion.div>

        {/* Error banner */}
        {error && (
          <motion.div role="alert" aria-live="polite" className="error-banner" {...(reduce ? {} : { initial: { opacity: 0, y: -6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } })} style={{ marginBottom: 20 }}>
            <AlertCircle size={15} strokeWidth={2} style={{ flexShrink: 0 }} />
            {error}
          </motion.div>
        )}

        {/* ── STEP 1 — File upload ──────────────────────────────────────── */}
        {!importResult && (
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
                <Upload size={15} color="var(--accent)" strokeWidth={2} />
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 650, letterSpacing: "-0.015em", color: "var(--text-primary)" }}>Upload Chrome bookmarks file</h2>
            </div>

            {/* Drop zone */}
            <label
              htmlFor="chromeimport"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                padding: "36px 24px",
                borderRadius: "var(--r-lg)",
                border: `2px dashed ${importedfile ? "rgb(255 49 98 / 0.45)" : "var(--glass-border)"}`,
                background: importedfile ? "var(--accent-dim)" : "var(--glass-bg-subtle)",
                cursor: "pointer",
                transition: "border-color var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)",
              }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "var(--r-md)",
                  flexShrink: 0,
                  background: importedfile ? "rgb(255 49 98 / 0.12)" : "var(--glass-bg-default)",
                  border: `1px solid ${importedfile ? "rgb(255 49 98 / 0.28)" : "var(--glass-border)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <FileText size={24} color={importedfile ? "var(--accent)" : "var(--text-muted)"} strokeWidth={1.5} />
              </div>

              {importedfile ? (
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{importedfile.name}</p>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>{(importedfile.size / 1024).toFixed(1)} KB — click to change</p>
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Click to choose a file</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", maxWidth: "42ch", lineHeight: 1.5 }}>Export from Chrome → Bookmarks Manager → ⋮ menu → Export bookmarks</p>
                </div>
              )}

              <input type="file" accept=".html" name="chromeimport" id="chromeimport" onChange={handleFileChange} style={{ display: "none" }} aria-label="Upload Chrome bookmarks HTML file" />
            </label>

            {/* Preview button — only shown after file selected, before preview loaded */}
            {importedfile && editableLinks.length === 0 && (
              <button onClick={handlepreview} disabled={loading} className="btn-primary full" style={{ marginTop: 16, height: 48, gap: "8px", color: "#fff" }} aria-busy={loading}>
                {loading ? (
                  <>
                    <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: "50%", border: "2px solid rgb(255 255 255 / 0.30)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite", flexShrink: 0 }} aria-hidden="true" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Eye size={15} strokeWidth={2} />
                    Preview Bookmarks
                  </>
                )}
              </button>
            )}
          </motion.div>
        )}

        {/* ── STEP 2 — Review table ─────────────────────────────────────── */}
        {editableLinks.length > 0 && !importResult && (
          <motion.div {...(reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] } })}>
            {/* Section header row */}
            <div className="glass r-lg" style={{ padding: "16px 20px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 650, color: "var(--text-primary)", marginBottom: 2 }}>
                  Found <span style={{ color: "var(--accent)" }}>{editableLinks.length}</span> bookmarks
                  {selectedIndexes.size > 0 && <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: 13, marginLeft: 8 }}>· {selectedIndexes.size} selected</span>}
                </h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Review and edit categories before importing</p>
              </div>

              {/* Header action buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {/* Select all / deselect all */}
                <button onClick={handleSelectAll} className="btn-ghost" style={{ height: 36, padding: "0 14px", fontSize: 12 }}>
                  {selectedIndexes.size === editableLinks.length ? "Deselect All" : "Select All"}
                </button>

                {/* Delete selected — only shown when something is selected */}
                {selectedIndexes.size > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    style={{
                      height: 36,
                      padding: "0 14px",
                      fontSize: 12,
                      background: "rgb(255 49 98 / 0.12)",
                      border: "1px solid rgb(255 49 98 / 0.30)",
                      borderRadius: 8,
                      color: "var(--accent)",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}>
                    Delete {selectedIndexes.size} selected
                  </button>
                )}

                {/* Import button */}
                <button onClick={handleconfirm} disabled={loading} className="btn-primary" style={{ height: 42, gap: "8px", padding: "0 20px", color: "#fff" }} aria-busy={loading}>
                  {loading ? (
                    <>
                      <span style={{ display: "inline-block", width: 13, height: 13, borderRadius: "50%", border: "2px solid rgb(255 255 255 / 0.30)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite", flexShrink: 0 }} aria-hidden="true" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <ArrowRight size={14} strokeWidth={2} />
                      Import All {editableLinks.length}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Link rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {editableLinks.map((link, index) => (
                <motion.div
                  key={index}
                  {...(reduce
                    ? {}
                    : {
                        initial: { opacity: 0, y: 8 },
                        animate: { opacity: 1, y: 0 },
                        transition: { duration: 0.3, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] },
                      })}
                  className="glass-subtle r-md"
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", flexWrap: "wrap" }}>
                  {/* Checkbox */}
                  <input type="checkbox" checked={selectedIndexes.has(index)} onChange={() => handleToggleSelect(index)} style={{ width: 16, height: 16, flexShrink: 0, cursor: "pointer", accentColor: "var(--accent)" }} />

                  {/* Favicon avatar */}
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      background: domainColor(link.url),
                      border: "1px solid var(--glass-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--text-secondary)",
                      flexShrink: 0,
                    }}>
                    {getInitials(link.url)}
                  </div>

                  {/* Title + URL */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 1 }}>{link.title || getDomain(link.url)}</p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link.url}</p>
                  </div>

                  {/* Confidence badge */}
                  {link.confidence && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 999,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        background: link.confidence >= 0.8 ? "rgb(48 209 88 / 0.12)" : "var(--glass-bg-subtle)",
                        border: `1px solid ${link.confidence >= 0.8 ? "rgb(48 209 88 / 0.30)" : "var(--glass-border)"}`,
                        color: link.confidence >= 0.8 ? "#30d158" : "var(--text-muted)",
                      }}>
                      {Math.round(link.confidence * 100)}%
                    </span>
                  )}

                  {/* Category select */}
                  <GlassSelect value={link.customTag || link.category || "Personal"} onChange={(val) => handlecategorychange(index, val)} options={["Personal", "Entertainment", "Knowledge", "Instagram", ...(link.customTag ? [{ value: link.customTag, label: `${link.customTag} (AI)` }] : [])]} aria-label={`Category for ${link.title || getDomain(link.url)}`} height={32} fontSize={12} />

                  {/* Delete row button */}
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

            {/* Bottom confirm CTA */}
            <button onClick={handleconfirm} disabled={loading} className="btn-primary full" style={{ marginTop: 20, height: 48, gap: "8px", color: "#fff" }} aria-busy={loading}>
              {loading ? (
                <>
                  <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: "50%", border: "2px solid rgb(255 255 255 / 0.30)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite", flexShrink: 0 }} aria-hidden="true" />
                  Importing...
                </>
              ) : (
                <>
                  <ArrowRight size={15} strokeWidth={2} />
                  {editableLinks.length} Bookmarks
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* ── STEP 3 — Success ──────────────────────────────────────────── */}
        {importResult && (
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
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 28 }}>Your Chrome bookmarks have been imported successfully.</p>

            {/* Stats */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 28, flexWrap: "wrap" }}>
              <div className="glass r-lg" style={{ padding: "14px 28px", minWidth: 120 }}>
                <p style={{ fontSize: 32, fontWeight: 760, letterSpacing: "-0.04em", color: "var(--accent)", lineHeight: 1, marginBottom: 4 }}>{importResult.inserted}</p>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>Imported</p>
              </div>
              <div className="glass r-lg" style={{ padding: "14px 28px", minWidth: 120 }}>
                <p style={{ fontSize: 32, fontWeight: 760, letterSpacing: "-0.04em", color: "var(--text-secondary)", lineHeight: 1, marginBottom: 4 }}>{importResult.skipped}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                  <SkipForward size={10} strokeWidth={2} color="var(--text-muted)" />
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>Skipped</p>
                </div>
              </div>
            </div>

            <hr className="divider" style={{ marginBottom: 24 }} />

            <button className="btn-primary full" onClick={() => navigate("/dashboard")} style={{ height: 48, gap: "8px", color: "#fff" }}>
              <LayoutDashboard size={15} strokeWidth={2} />
              Go to Dashboard
            </button>
          </motion.div>
        )}
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
