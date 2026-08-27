import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ValidEmail , ValidPassword , ValidUserName } from "../utils/Validators";
import { registerUser } from "../api/authapi";
export default function Register(){
  const [username,setUsername] = useState("");
  const [useremail,setUseremail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("")
  const navigate = useNavigate();
  const handleEvent = async (e) => {
      e.preventDefault();
    if(!username || !password || !useremail){
         setError("Please fill in all fields")
    return;
      }
    if (!ValidEmail(useremail)) {
        setError("Enter a valid email address")
    return
      }
    if (!ValidUserName(username)) {
        setError("Username must be 5-16 characters")
    return
      }
    if (!ValidPassword(password)) {
        setError("Password needs 8+ chars, uppercase, number, and special character (@$!%*?&)")
    return
    }
    setLoading(true)
    try {
      await registerUser({useremail,username,password});
      navigate("/login")
      
    } catch (err) {
        setError(err.response?.data?.message || "Registration Failed")
    }
    finally{
      setLoading(false)
    }
  }
  return (
    <>
      <h1>Register - Page</h1>
      <div>
        <form onSubmit={handleEvent}>
          <input type="email" name="" id="" placeholder="E-mail" value={useremail} onChange={(e) => setUseremail(e.target.value)} required />
          <input type="text" name="" id="" placeholder="User-name" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" name="" id="" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
         <button type="submit" disabled={loading}>
          {loading ? "Registering.." : "Register"}
        </button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </>
  );
}