import { createContext, useContext, useEffect, useState } from "react";
import { LoginUser, LogoutUser, getCurrentUser } from "../api/authapi.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,        setUser]        = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [isWakingUp,  setIsWakingUp]  = useState(false);

  useEffect(() => {
    // After 3 seconds, if the auth check still hasn't finished, the
    // free-tier server is likely cold-starting. Show the wakeup message.
    const wakeTimer = setTimeout(() => {
      setIsWakingUp(true);
    }, 3000);

    getCurrentUser()
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null))
      .finally(() => {
        clearTimeout(wakeTimer);   // cancel the timer if server responded fast
        setIsWakingUp(false);      // clear wakeup state regardless
        setLoading(false);
      });

    // Cleanup in case the component unmounts before the request finishes
    return () => clearTimeout(wakeTimer);
  }, []);

  const login = async (data) => {
    const res = await LoginUser(data);
    setUser(res.data.user);
  };

  const logout = async () => {
    await LogoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isWakingUp }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
