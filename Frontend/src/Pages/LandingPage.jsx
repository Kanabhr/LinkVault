import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import {
  Bookmark,
  Layers,
  Globe,
  Tag,
  Search,
  Upload,
  ArrowRight,
  Zap,
} from "lucide-react";
import "../styles/glass.css";
import "@fontsource-variable/geist";

// ─── Motion helpers ────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
});

// ─── Mock bookmarks for the preview card ──────────────────────────────────
const MOCK_BOOKMARKS = [
  { id: 1, initials: "GH", name: "GitHub",  domain: "github.com",  cat: "Dev",           color: "#1a1a2e" },
  { id: 2, initials: "YT", name: "YouTube", domain: "youtube.com", cat: "Media",         color: "#1a0d0d" },
  { id: 3, initials: "No", name: "Notion",  domain: "notion.so",   cat: "Productivity",  color: "#0d0d1a" },
  { id: 4, initials: "Fi", name: "Figma",   domain: "figma.com",   cat: "Design",        color: "#0d1a16" },
];

// ─── Feature grid data ─────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Upload,
    title: "Bulk Save",
    desc: "Paste multiple URLs at once — separated by newline, space, or comma. Save dozens of links in seconds.",
    accent: false,
  },
  {
    icon: Layers,
    title: "Smart Categories",
    desc: "Four preset categories ready from day one. Create unlimited custom tags to organize exactly the way you think.",
    accent: true,
  },
  {
    icon: Globe,
    title: "Public Profiles",
    desc: "Share your entire bookmark collection via a public link. Great for curations, reading lists, or resources.",
    accent: false,
  },
  {
    icon: Tag,
    title: "Custom Tags",
    desc: "Tag every link with precision. Your taxonomy, not ours.",
    accent: false,
  },
  {
    icon: Search,
    title: "Quick Access",
    desc: "Search, filter, and open any saved link directly from your profile.",
    accent: false,
  },
  {
    icon: Zap,
    title: "Bulk Import",
    desc: "YouTube history and Chrome bookmarks import with auto-categorization. Coming soon.",
    accent: false,
  },
];

// ─── Bookmark preview card ─────────────────────────────────────────────────
function BookmarkPreview({ reduce }) {
  return (
    <motion.div
      {...(reduce ? {} : fadeIn(0.4))}
      className="glass-strong r-xl card-glass"
      style={{ width: "100%", maxWidth: 420, margin: "0 auto" }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.04em" }}>
          My Bookmarks
        </span>
        <span className="badge badge-accent">4 saved</span>
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {MOCK_BOOKMARKS.map((item, i) => (
          <motion.div
            key={item.id}
            {...(reduce ? {} : {
              initial: { opacity: 0, x: -12 },
              animate: { opacity: 1, x: 0 },
              transition: { duration: 0.4, delay: 0.55 + i * 0.08, ease: [0.16, 1, 0.3, 1] },
            })}
            className="glass-subtle r-md"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
            }}
          >
            {/* Favicon placeholder */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: item.color,
                border: "1px solid var(--glass-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text-secondary)",
                flexShrink: 0,
              }}
            >
              {item.initials}
            </div>

            {/* Name + domain */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 1, lineHeight: 1.3 }}>
                {item.name}
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.domain}
              </p>
            </div>

            {/* Category badge */}
            <span className="badge" style={{ flexShrink: 0, fontSize: 10 }}>{item.cat}</span>
          </motion.div>
        ))}
      </div>

      {/* Bottom accent line */}
      <div style={{ marginTop: 20 }}>
        <div className="accent-line" style={{ height: 2 }} />
      </div>
    </motion.div>
  );
}

// ─── Feature card ──────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, accent, delay, reduce }) {
  return (
    <motion.div
      {...(reduce ? {} : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
      })}
      className={accent ? "glass-strong r-lg card-glass" : "glass r-lg card-glass"}
      style={{ display: "flex", flexDirection: "column", gap: 14, height: "100%" }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "var(--r-md)",
          background: accent ? "var(--accent-dim)" : "var(--glass-bg-default)",
          border: `1px solid ${accent ? "rgb(255 49 98 / 0.28)" : "var(--glass-border)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={18} color={accent ? "var(--accent)" : "var(--text-secondary)"} strokeWidth={1.75} />
      </div>
      <div>
        <h3 style={{ fontSize: 15, fontWeight: 650, color: "var(--text-primary)", marginBottom: 6, letterSpacing: "-0.01em" }}>
          {title}
        </h3>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55 }}>
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export default function LandingPage() {
  const reduce = useReducedMotion();

  return (
    <div style={{ position: "relative", minHeight: "100dvh" }}>
      {/* Ambient background */}
      <div className="page-bg" aria-hidden="true" />

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="nav-glass" role="navigation" aria-label="Main navigation">
        <Link to="/" className="nav-logo">
          <div className="nav-logo-mark" aria-hidden="true">B</div>
          BMS
        </Link>
        <div className="nav-actions">
          <Link to="/login" className="btn-ghost" style={{ height: 36, padding: "0 16px", fontSize: 13 }}>
            Sign in
          </Link>
          <Link to="/register" className="btn-primary" style={{ height: 36, padding: "0 18px", fontSize: 13 }}>
            Get started
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        aria-label="Hero"
        style={{
          position: "relative",
          zIndex: 1,
          paddingTop: "clamp(100px, 15vh, 140px)",
          paddingBottom: "clamp(60px, 8vh, 100px)",
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          {/* Left — copy */}
          <div>
            <motion.div {...(reduce ? {} : fadeUp(0.05))} style={{ marginBottom: 16 }}>
              <span className="badge badge-accent">
                <Bookmark size={10} strokeWidth={2.5} />
                Bookmark Manager
              </span>
            </motion.div>

            <motion.h1
              {...(reduce ? {} : fadeUp(0.12))}
              style={{
                fontSize: "clamp(36px, 5vw, 60px)",
                fontWeight: 760,
                letterSpacing: "-0.035em",
                lineHeight: 1.08,
                color: "var(--text-primary)",
                marginBottom: 20,
              }}
            >
              Save links.
              <br />
              <span style={{ color: "var(--accent)" }}>Organize.</span>{" "}Share.
            </motion.h1>

            <motion.p
              {...(reduce ? {} : fadeUp(0.2))}
              style={{
                fontSize: 17,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                maxWidth: "52ch",
                marginBottom: 32,
              }}
            >
              BMS lets you save, categorize, and share bookmarks. Paste multiple URLs at once, tag them, and access from anywhere.
            </motion.p>

            <motion.div
              {...(reduce ? {} : fadeUp(0.28))}
              style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
            >
              <Link to="/register" className="btn-primary">
                Start for free
                <ArrowRight size={15} strokeWidth={2} />
              </Link>
              <Link to="/login" className="btn-ghost">
                Sign in
              </Link>
            </motion.div>
          </div>

          {/* Right — preview */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <BookmarkPreview reduce={reduce} />
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section
        aria-label="Features"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "clamp(60px, 8vh, 96px) 24px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Section header */}
          <motion.div
            {...(reduce ? {} : {
              initial: { opacity: 0, y: 16 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, amount: 0.4 },
              transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
            })}
            style={{ marginBottom: 48, maxWidth: 560 }}
          >
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 720, letterSpacing: "-0.025em", color: "var(--text-primary)", marginBottom: 12, lineHeight: 1.15 }}>
              Everything you need to manage links
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Built for people who save a lot of links and actually want to find them later.
            </p>
          </motion.div>

          {/* 3-col asymmetric: first card spans 2 rows on the right, others fill left */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
          >
            {FEATURES.map((feat, i) => (
              <FeatureCard
                key={feat.title}
                {...feat}
                delay={i * 0.07}
                reduce={reduce}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section
        aria-label="Call to action"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "clamp(60px, 8vh, 96px) 24px",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <motion.div
            {...(reduce ? {} : {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, amount: 0.5 },
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
            })}
            className="glass-strong r-xl"
            style={{ padding: "clamp(32px, 5vw, 56px) clamp(24px, 5vw, 48px)" }}
          >
            <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 720, letterSpacing: "-0.025em", color: "var(--text-primary)", marginBottom: 12, lineHeight: 1.2 }}>
              Ready to organize your links?
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 28, lineHeight: 1.55 }}>
              Free to use. No credit card required.
            </p>
            <Link to="/register" className="btn-primary" style={{ height: 48, padding: "0 32px", fontSize: 15 }}>
              Create your account
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer
        role="contentinfo"
        style={{
          position: "relative",
          zIndex: 1,
          borderTop: "1px solid var(--glass-border)",
          padding: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Link to="/" className="nav-logo" style={{ fontSize: 14 }}>
          <div className="nav-logo-mark" style={{ width: 22, height: 22, fontSize: 10 }}>B</div>
          BMS
        </Link>
        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
          Bookmark Manager &copy; 2026
        </p>
      </footer>

      {/* ── Responsive styles ─────────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 768px) {
          section[aria-label="Hero"] > div > div {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          section[aria-label="Features"] > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
          footer {
            justify-content: center !important;
            text-align: center;
          }
        }
        @media (max-width: 640px) {
          .nav-glass { padding: 0 16px; }
        }
      `}</style>
    </div>
  );
}
