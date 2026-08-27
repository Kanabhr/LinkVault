import { useState } from "react";
import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const handleEvent = async (e) => {
    e.preventDefault();
     
    if (!username || !password) {
       setError("Please fill in all fields")
     return;
    }
     setLoading(true)
    try {
      await login({ username, password });
      navigate("/dashboard")
      }
      catch (err) {
    setError(err.response?.data?.message || "Login Failed")
    }
    finally{
      setLoading(false)
    }
  };
  return (
    <>
      <h1>Login - Page</h1>
      <div>
        <form onSubmit={handleEvent}>
          <input type="text" name="" id="" placeholder="User-name" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" name="" id="" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
         <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </>
  );
}
