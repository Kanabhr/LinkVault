import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import axios from "axios";
import "./App.css";
import { useEffect } from "react";
import Register from "../Auth/Register";
import Dashboard from "./Dashboard";
import Login from "../Auth/Login";
function App() {
  return (
    <>
      <Register />
      <Dashboard />
      <Login />
    </>
  );
}

export default App;
