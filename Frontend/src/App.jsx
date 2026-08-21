import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import RegisterForm from "./components/new";
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0b2b26]">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/new" element={<RegisterForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
