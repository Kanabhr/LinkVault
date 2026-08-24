import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/Authcontext.jsx";

// Wraps routes that require login
// Usage in App.jsx:
// <Route element={<ProtectedRoute />}>
//   <Route path="/dashboard" element={<Dashboard />} />
// </Route>

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  // Auth check still running — don't redirect yet
  // Without this, user gets kicked to /login on every page refresh
  // before getCurrentUser() has a chance to finish
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b2b26]">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
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
