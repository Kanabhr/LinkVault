import { Navigate, Outlet } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { useAuth } from "../context/Authcontext.jsx";
import "../styles/glass.css";

// Wraps routes that require login
// Usage in App.jsx:
// <Route element={<ProtectedRoute />}>
//   <Route path="/dashboard" element={<Dashboard />} />
// </Route>

export default function ProtectedRoute() {
  const { user, loading, isWakingUp } = useAuth();
  const reduce = useReducedMotion();

  // Auth check still running — show full-screen loader
  // Without this, user gets kicked to /login on every page refresh
  // before getCurrentUser() has a chance to finish
  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          background: "var(--bg-deep)",
        }}
        role="status"
        aria-label="Loading"
      >
        {/* Ambient background orbs */}
        <div className="page-bg" aria-hidden="true" />

        {/* Logo mark */}
        <div
          className="nav-logo-mark"
          style={{ width: 48, height: 48, fontSize: 20, borderRadius: 14, zIndex: 1 }}
          aria-hidden="true"
        >
          B
        </div>

        {/* Spinner ring */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "3px solid rgb(255 255 255 / 0.08)",
            borderTopColor: "var(--accent)",
            animation: "spin 0.75s linear infinite",
            zIndex: 1,
          }}
          aria-hidden="true"
        />

        {/* Wakeup message — fades in after 3 seconds */}
        {isWakingUp && (
          <motion.div
            {...(reduce ? {} : {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
            })}
            style={{
              textAlign: "center",
              maxWidth: 320,
              padding: "0 24px",
              zIndex: 1,
            }}
          >
            <p style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: 8,
              fontFamily: "'Geist Variable', system-ui, sans-serif",
            }}>
              Starting up the server...
            </p>
            <p style={{
              fontSize: 13,
              color: "var(--text-muted)",
              lineHeight: 1.6,
              fontFamily: "'Geist Variable', system-ui, sans-serif",
            }}>
              Free tier servers sleep after inactivity. Usually takes about 30 seconds.
            </p>
          </motion.div>
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Auth check done — no user found, send to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Auth check done — user exists, render the child route
  return <Outlet />;
}
