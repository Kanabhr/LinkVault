import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// All Pages
import LandingPage from "./Pages/LandingPage";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import UserProfile from "./Pages/UserProfile";
import Categories from "./Pages/Categories";
import PublicProfile from "./Pages/PublicProfile";
import Notfound from "./Pages/Notfound";
import ImportPage from "./Pages/ImportPage";
// Route guards
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages — accessible by everyone */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/u/:username" element={<PublicProfile />} />
        <Route path="*" element={<Notfound />} />

        {/* Auth pages — redirect to /dashboard if already logged in */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected pages — redirect to /login if not logged in */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/import" element={<ImportPage/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
