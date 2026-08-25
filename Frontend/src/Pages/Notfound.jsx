import { useNavigate } from "react-router-dom"

export default function Notfound() {
  const navigate = useNavigate()

  return (
    <>
      <h1>404</h1>
      <h2>Page you are looking for does not exist</h2>
      <div>
        <button onClick={() => navigate("/")}>Go to Home</button>
        <button onClick={() => navigate("/profile")}>Go to Profile</button>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    </>
  )
}
