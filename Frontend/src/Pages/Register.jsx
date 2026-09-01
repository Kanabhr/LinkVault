import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { Mail, User, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { ValidEmail, ValidPassword, ValidUserName } from "../utils/Validators";
import { registerUser } from "../api/authapi";
import "../styles/glass.css";
import "@fontsource-variable/geist";

// ─── Password strength indicator ──────────────────────────────────────────
function PasswordStrength({ password }) {
  if (!password) return null;

  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[@$!%*?&]/.test(password),
  ];
  const strength = checks.filter(Boolean).length;

  const colors = ["#ff3162", "#ff6b35", "#f5a623", "#30d158"];
  const labels = ["Weak", "Fair", "Good", "Strong"];

  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 4,
              background: i < strength ? colors[strength - 1] : "var(--glass-border)",
              transition: "background 0.3s ease",
              boxShadow: i < strength ? `0 0 6px ${colors[strength - 1]}60` : "none",
            }}
          />
        ))}
      </div>
      <p style={{ fontSize: 11, color: strength >= 3 ? "#30d158" : "var(--text-muted)" }}>
        {labels[strength - 1] ?? "Enter a password"}
      </p>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export default function Register() {
  const navigate = useNavigate();

  const [useremail, setUseremail] = useState("");
  const [username, setUsername]   = useState("");
  const [password, setPassword]   = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(false);

  const reduce = useReducedMotion();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!useremail || !username || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (!ValidEmail(useremail)) {
      setError("Enter a valid email address");
      return;
    }
    if (!ValidUserName(username)) {
      setError("Username must be 5-16 characters, letters and numbers only");
      return;
    }
    if (!ValidPassword(password)) {
      setError("Password needs 8+ characters, uppercase, number, and special character (@$!%*?&)");
      return;
    }

    setLoading(true);
    try {
      await registerUser({ useremail, username, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1400);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
            Have an account?
          </span>
          <Link to="/login" className="btn-ghost" style={{ height: 36, padding: "0 16px", fontSize: 13 }}>
            Sign in
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
          style={{ width: "100%", maxWidth: 440 }}
        >
          <div className="glass-strong r-xl card-glass">

            {/* Success state */}
            {success ? (
              <motion.div
                {...(reduce ? {} : {
                  initial: { opacity: 0, scale: 0.92 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                })}
                style={{ textAlign: "center", padding: "24px 0" }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "rgb(48 209 88 / 0.12)",
                    border: "1px solid rgb(48 209 88 / 0.28)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    boxShadow: "0 4px 20px rgb(48 209 88 / 0.20)",
                  }}
                  aria-hidden="true"
                >
                  <CheckCircle2 size={26} color="#30d158" strokeWidth={1.75} />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8, letterSpacing: "-0.015em" }}>
                  Account created
                </h2>
                <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                  Redirecting you to sign in...
                </p>
              </motion.div>
            ) : (
              <>
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
                    <User size={20} color="var(--accent)" strokeWidth={1.75} />
                  </div>
                  <h1 style={{ fontSize: 22, fontWeight: 720, letterSpacing: "-0.02em", color: "var(--text-primary)", marginBottom: 6 }}>
                    Create your account
                  </h1>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                    Free to use. No credit card needed.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Email */}
                  <div className="field">
                    <label htmlFor="email" className="field-label">Email</label>
                    <div className="input-wrapper">
                      <span className="input-icon" aria-hidden="true">
                        <Mail size={16} strokeWidth={1.75} />
                      </span>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        className="input-glass"
                        placeholder="you@example.com"
                        value={useremail}
                        onChange={(e) => { setUseremail(e.target.value); setError(""); }}
                        required
                        aria-required="true"
                        aria-describedby={error ? "register-error" : undefined}
                      />
                    </div>
                  </div>

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
                        className="input-glass"
                        placeholder="5-16 characters"
                        value={username}
                        onChange={(e) => { setUsername(e.target.value); setError(""); }}
                        required
                        aria-required="true"
                        minLength={5}
                        maxLength={16}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="field">
                    <label htmlFor="reg-password" className="field-label">Password</label>
                    <div className="input-wrapper">
                      <span className="input-icon" aria-hidden="true">
                        <Lock size={16} strokeWidth={1.75} />
                      </span>
                      <input
                        id="reg-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className="input-glass"
                        placeholder="8+ characters"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(""); }}
                        required
                        aria-required="true"
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
                    <PasswordStrength password={password} />
                  </div>

                  {/* Error */}
                  {error && (
                    <motion.div
                      id="register-error"
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
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create account
                        <ArrowRight size={15} strokeWidth={2} />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider + login link */}
                <div style={{ marginTop: 24 }}>
                  <hr className="divider" />
                  <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-secondary)", marginTop: 20 }}>
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </>
            )}
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
