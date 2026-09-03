import { useRef, useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, User, Layers, Upload,
  Globe, LogOut, ExternalLink
} from "lucide-react";
import { useAuth } from "../context/Authcontext";

// ─── All nav items defined once here ────────────────────────────────────────
const NAV_ITEMS = [
  { to: "/dashboard",  icon: LayoutDashboard, label: "Dashboard"  },
  { to: "/profile",    icon: User,            label: "Profile"    },
  { to: "/categories", icon: Layers,          label: "Categories" },
  { to: "/import",     icon: Upload,          label: "Import"     },
];

const SIDEBAR_WIDTH   = 260;
const COLLAPSED_WIDTH = 60;
const MIN_WIDTH       = COLLAPSED_WIDTH;
const MAX_WIDTH       = 360;

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [width, setWidth] = useState(() =>
    parseInt(localStorage.getItem("sidebarWidth") || SIDEBAR_WIDTH)
  );
  const [isDragging, setIsDragging] = useState(false);
  const collapsed = width <= COLLAPSED_WIDTH + 10;

  // ── Persist width ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isDragging) localStorage.setItem("sidebarWidth", width);
  }, [width, isDragging]);

  // ── Drag resize ──────────────────────────────────────────────────────────
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX)));
    };
    const onUp = () => {
      setIsDragging(false);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.body.style.cursor     = "col-resize";
    document.body.style.userSelect = "none";
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.style.cursor     = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* ── Fixed sidebar panel ──────────────────────────────────────── */}
      <aside
        className="glass-strong"
        style={{
          position: "fixed", top: 0, left: 0, bottom: 0, width,
          zIndex: 40, display: "flex", flexDirection: "column",
          padding: "20px 12px",
          borderRight: "1px solid var(--glass-border)", borderRadius: 0,
          background: "rgb(10 10 14 / 0.72)",
          backdropFilter: "blur(32px) saturate(200%)",
          WebkitBackdropFilter: "blur(32px) saturate(200%)",
          transition: isDragging ? "none" : "width 120ms ease",
          overflow: "hidden",
        }}
        role="navigation"
        aria-label="App navigation"
      >
        {/* Logo */}
        <Link
          to="/dashboard"
          style={{
            display: "flex", alignItems: "center", gap: 8,
            textDecoration: "none", marginBottom: 28,
            paddingLeft: 4, justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <div className="nav-logo-mark">B</div>
          {!collapsed && (
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
              BMS
            </span>
          )}
        </Link>

        {/* Nav items */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} style={{ textDecoration: "none" }} title={collapsed ? label : undefined}>
                <div
                  className={active ? "glass r-md" : "r-md"}
                  style={{
                    display: "flex", alignItems: "center",
                    gap: collapsed ? 0 : 10,
                    padding: "10px 12px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                    background: active ? "var(--glass-bg-default)" : "transparent",
                    borderRadius: "var(--r-md)",
                    transition: "background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)",
                    cursor: "pointer",
                  }}
                >
                  <Icon size={16} strokeWidth={active ? 2.2 : 1.75}
                    color={active ? "var(--accent)" : "var(--text-secondary)"} />
                  {!collapsed && (
                    <span style={{ fontSize: 14, fontWeight: active ? 600 : 500 }}>{label}</span>
                  )}
                  {!collapsed && active && (
                    <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: "var(--accent)" }} />
                  )}
                </div>
              </Link>
            );
          })}

          <a
            href={`/u/${user?.username}`}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none" }}
            title={collapsed ? "Public Profile" : undefined}
          >
            <div className="r-md" style={{
              display: "flex", alignItems: "center",
              gap: collapsed ? 0 : 10,
              padding: "10px 12px",
              justifyContent: collapsed ? "center" : "flex-start",
              color: "var(--text-secondary)", cursor: "pointer",
              borderRadius: "var(--r-md)",
              transition: "background var(--dur-base) var(--ease-out)",
            }}>
              <Globe size={16} strokeWidth={1.75} />
              {!collapsed && (
                <>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>Public Profile</span>
                  <ExternalLink size={12} strokeWidth={1.75} style={{ marginLeft: "auto", opacity: 0.5 }} />
                </>
              )}
            </div>
          </a>
        </nav>

        {/* User + logout */}
        <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: 12 }}>
          {!collapsed && (
            <div className="glass-subtle r-md" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", marginBottom: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", background: "var(--accent-dim)",
                border: "1px solid rgb(255 49 98 / 0.28)", display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0, fontSize: 12, fontWeight: 700, color: "var(--accent)",
              }}>
                {user?.username?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user?.username}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="btn-ghost full"
            title={collapsed ? "Sign out" : undefined}
            style={{ height: 38, fontSize: 13, gap: 8, justifyContent: "center" }}
          >
            <LogOut size={14} strokeWidth={1.75} />
            {!collapsed && "Sign out"}
          </button>
        </div>

        {/* ── Drag handle ───────────────────────────────────────────── */}
        <div
          onMouseDown={handleMouseDown}
          style={{
            position: "absolute", top: 0, right: 0, bottom: 0, width: 4,
            cursor: "col-resize",
            background: isDragging ? "var(--accent)" : "transparent",
            transition: "background 150ms ease",
            zIndex: 10,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--glass-border-hi)"; }}
          onMouseLeave={(e) => { if (!isDragging) e.currentTarget.style.background = "transparent"; }}
        />
      </aside>

      {/* ── Spacer keeps main content from going under sidebar ────────── */}
      <div
        style={{
          width,
          flexShrink: 0,
          transition: isDragging ? "none" : "width 120ms ease",
        }}
        aria-hidden="true"
      />
    </>
  );
}
