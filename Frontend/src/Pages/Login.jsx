import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { User, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "../context/Authcontext";
import "../styles/glass.css";
import "@fontsource-variable/geist";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const reduce = useReducedMotion();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await login({ username: username.trim(), password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      {/* Ambient background */}
      <div className="page-bg" aria-hidden="true" />

      {/* Nav */}
      <nav className="nav-glass" role="navigation" aria-label="Main navigation">
        <Link to="/" className="nav-logo">
          <div className="nav-logo-mark" aria-hidden="true">B</div>
          BMS
        </Link>
        <div className="nav-actions">
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            No account?
          </span>
          <Link to="/register" className="btn-primary" style={{ height: 36, padding: "0 18px", fontSize: 13 }}>
            Sign up free
          </Link>
        </div>
      </nav>

      {/* Form area */}
      <main
        role="main"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(80px, 12vh, 120px) 24px 48px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.div
          {...(reduce ? {} : {
            initial: { opacity: 0, y: 28, scale: 0.97 },
            animate: { opacity: 1, y: 0, scale: 1 },
            transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
          })}
          style={{ width: "100%", maxWidth: 420 }}
        >
          <div className="glass-strong r-xl card-glass">
            {/* Header */}
            <div style={{ marginBottom: 28, textAlign: "center" }}>
              <div
                aria-hidden="true"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "var(--r-md)",
                  background: "var(--accent-dim)",
                  border: "1px solid rgb(255 49 98 / 0.28)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  boxShadow: "0 4px 16px rgb(255 49 98 / 0.18)",
                }}
              >
                <Lock size={20} color="var(--accent)" strokeWidth={1.75} />
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 720, letterSpacing: "-0.02em", color: "var(--text-primary)", marginBottom: 6 }}>
                Welcome back
              </h1>
              <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                Sign in to your BMS account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Username */}
              <div className="field">
                <label htmlFor="username" className="field-label">Username</label>
                <div className="input-wrapper">
                  <span className="input-icon" aria-hidden="true">
                    <User size={16} strokeWidth={1.75} />
                  </span>
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    className={`input-glass${error && !username ? " error" : ""}`}
                    placeholder="your-username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(""); }}
                    required
                    aria-required="true"
                    aria-describedby={error ? "login-error" : undefined}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="field">
                <label htmlFor="password" className="field-label">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon" aria-hidden="true">
                    <Lock size={16} strokeWidth={1.75} />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className={`input-glass${error && !password ? " error" : ""}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    required
                    aria-required="true"
                    aria-describedby={error ? "login-error" : undefined}
                    style={{ paddingRight: 48 }}
                  />
                  <button
                    type="button"
                    className="input-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword
                      ? <EyeOff size={16} strokeWidth={1.75} />
                      : <Eye size={16} strokeWidth={1.75} />
                    }
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  id="login-error"
                  role="alert"
                  aria-live="polite"
                  className="error-banner"
                  {...(reduce ? {} : {
                    initial: { opacity: 0, y: -6 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                  })}
                >
                  <AlertCircle size={15} strokeWidth={2} style={{ flexShrink: 0 }} />
                  {error}
                </motion.div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="btn-primary full"
                disabled={loading}
                aria-busy={loading}
                style={{ marginTop: 4 }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      border: "2px solid rgb(255 255 255 / 0.30)",
                      borderTopColor: "#fff",
                      animation: "spin 0.7s linear infinite",
                      flexShrink: 0,
                    }} aria-hidden="true" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={15} strokeWidth={2} />
                  </>
                )}
              </button>
            </form>

            {/* Divider + register link */}
            <div style={{ marginTop: 24 }}>
              <hr className="divider" />
              <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-secondary)", marginTop: 20 }}>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}
                >
                  Create one free
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 480px) {
          .nav-glass { padding: 0 16px; }
          .card-glass { padding: 20px; }
        }
      `}</style>
    </div>
  );
}
