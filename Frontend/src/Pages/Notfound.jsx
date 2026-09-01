import { useNavigate, Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { Home, User, LogIn, ArrowLeft, Bookmark } from "lucide-react";
import "../styles/glass.css";
import "@fontsource-variable/geist";

export default function Notfound() {
  const navigate = useNavigate();
  const reduce   = useReducedMotion();

  return (
    <div style={{ position:"relative",minHeight:"100dvh",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px" }}>
      <div className="page-bg" aria-hidden="true" />

      {/* Small top-left logo */}
      <Link to="/" className="nav-logo" style={{ position:"fixed",top:20,left:24,zIndex:10,fontSize:15,textDecoration:"none",display:"flex",alignItems:"center",gap:8,color:"var(--text-primary)" }}>
        <div className="nav-logo-mark" style={{ width:24,height:24,fontSize:11 }}>B</div>
        BMS
      </Link>

      <motion.div
        {...(reduce ? {} : {
          initial:{ opacity:0, y:32, scale:0.95 },
          animate:{ opacity:1, y:0,  scale:1    },
          transition:{ duration:0.6, ease:[0.16,1,0.3,1] },
        })}
        className="glass-strong r-xl"
        style={{ width:"100%",maxWidth:440,padding:"clamp(32px,5vw,52px)",textAlign:"center" }}
        role="main"
        aria-label="404 page not found"
      >
        {/* Icon */}
        <motion.div
          {...(reduce ? {} : { initial:{opacity:0,scale:0.7},animate:{opacity:1,scale:1},transition:{duration:0.5,delay:0.1,ease:[0.16,1,0.3,1]} })}
          style={{ marginBottom:20 }}
        >
          <div style={{
            width:64,height:64,borderRadius:"var(--r-lg)",
            background:"var(--accent-dim)",border:"1px solid rgb(255 49 98 / 0.28)",
            display:"flex",alignItems:"center",justifyContent:"center",
            margin:"0 auto",boxShadow:"0 8px 24px rgb(255 49 98 / 0.18)",
          }} aria-hidden="true">
            <Bookmark size={28} color="var(--accent)" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* 404 */}
        <motion.p
          {...(reduce ? {} : { initial:{opacity:0,y:12},animate:{opacity:1,y:0},transition:{duration:0.5,delay:0.15,ease:[0.16,1,0.3,1]} })}
          style={{ fontSize:"clamp(64px,12vw,96px)",fontWeight:800,letterSpacing:"-0.06em",color:"var(--accent)",lineHeight:1,marginBottom:8 }}
          aria-label="404"
        >
          404
        </motion.p>

        <motion.div
          {...(reduce ? {} : { initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:{duration:0.5,delay:0.22,ease:[0.16,1,0.3,1]} })}
        >
          <h1 style={{ fontSize:"clamp(17px,2.5vw,22px)",fontWeight:700,letterSpacing:"-0.02em",color:"var(--text-primary)",marginBottom:8 }}>
            Page not found
          </h1>
          <p style={{ fontSize:14,color:"var(--text-secondary)",lineHeight:1.55,marginBottom:28,maxWidth:"36ch",margin:"0 auto 28px" }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          {...(reduce ? {} : { initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:{duration:0.5,delay:0.3,ease:[0.16,1,0.3,1]} })}
          style={{ display:"flex",flexDirection:"column",gap:10 }}
        >
          <button
            className="btn-primary full"
            onClick={() => navigate("/")}
            style={{ height:46,gap:8 }}
          >
            <Home size={15} strokeWidth={2} />
            Go to Home
          </button>
          <button
            className="btn-ghost full"
            onClick={() => navigate("/profile")}
            style={{ height:46,gap:8 }}
          >
            <User size={15} strokeWidth={1.75} />
            My Profile
          </button>
          <button
            className="btn-ghost full"
            onClick={() => navigate("/login")}
            style={{ height:46,gap:8 }}
          >
            <LogIn size={15} strokeWidth={1.75} />
            Sign in
          </button>
        </motion.div>

        {/* Divider + back text */}
        <motion.div
          {...(reduce ? {} : { initial:{opacity:0},animate:{opacity:1},transition:{duration:0.4,delay:0.42,ease:[0.16,1,0.3,1]} })}
          style={{ marginTop:24 }}
        >
          <hr className="divider" />
          <button
            onClick={() => window.history.back()}
            style={{ marginTop:16,background:"none",border:"none",color:"var(--text-muted)",fontSize:13,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,transition:"color var(--dur-base) var(--ease-out)" }}
            onMouseEnter={e => e.currentTarget.style.color="var(--text-secondary)"}
            onMouseLeave={e => e.currentTarget.style.color="var(--text-muted)"}
          >
            <ArrowLeft size={13} strokeWidth={2} />
            Go back
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
