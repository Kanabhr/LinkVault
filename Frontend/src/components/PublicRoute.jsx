import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/Authcontext.jsx";
import "../styles/glass.css";
import "@fontsource-variable/geist";

// Wraps routes that should NOT be accessible when logged in
// Usage in App.jsx:
// <Route element={<PublicRoute />}>
//   <Route path="/login" element={<Login />} />
//   <Route path="/register" element={<Register />} />
// </Route>

export default function PublicRoute() {
  const { user, loading } = useAuth();

  // Still checking — show spinner, don't redirect yet
  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-deep)",
        }}
        aria-label="Loading"
        role="status"
      >
        <div className="page-bg" aria-hidden="true" />
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "3px solid rgb(255 255 255 / 0.10)",
            borderTopColor: "var(--accent)",
            animation: "spin 0.75s linear infinite",
          }}
          aria-hidden="true"
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Already logged in — redirect away from login/register
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Not logged in — show the login or register page
  return <Outlet />;
}
