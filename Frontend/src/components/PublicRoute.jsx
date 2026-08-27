import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/Authcontext.jsx";

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
      <div className="flex h-screen items-center justify-center bg-[#0b2b26]">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
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
