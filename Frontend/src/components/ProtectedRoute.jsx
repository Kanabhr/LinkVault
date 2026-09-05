import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/Authcontext.jsx";

// Wraps routes that require login
// Usage in App.jsx:
// <Route element={<ProtectedRoute />}>
//   <Route path="/dashboard" element={<Dashboard />} />
// </Route>

export default function ProtectedRoute() {
  const { user, loading , IswakingUp } = useAuth();

  // Auth check still running — don't redirect yet
  // Without this, user gets kicked to /login on every page refresh
  // before getCurrentUser() has a chance to finish
  if (loading) {
    return 
    <div>
      <p>Loading ...</p>
      {IswakingUp && <p>Server is starting up,Please wait</p>}
    </div>
  }

  // Auth check done — no user found, send to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Auth check done — user exists, render the child route
  return <Outlet />;
}
