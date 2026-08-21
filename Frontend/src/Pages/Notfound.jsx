import { Navigate } from "react-router-dom"
export default function Notfound(){
const navigate = Navigate()
    return<>
    <h2>Page you are looking for does not exist</h2><br />
    <h1 >404</h1>
<div>
    <button onClick={navigate("/")}>Go to Home</button>
    <button onClick={navigate("/userprofile")}>Go to Profile</button>
    <button onClick={navigate("/login")}>Go to Login</button>
</div>
</>
}