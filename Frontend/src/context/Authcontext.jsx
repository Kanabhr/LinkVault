import { createContext, useContext, useEffect, useState } from "react";
import { LoginUser, LogoutUser, getCurrentUser } from "../api/authapi.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => setUser(res.data.data))   // res.data = ApiResponse, .data = user
      .catch(() => setUser(null))              // 401 or network error = not logged in
      .finally(() => setLoading(false));       // either way, loading is done
  }, []);

  const login = async (data) => {
    const res = await LoginUser(data);
    setUser(res.data.user); // res.data.user = safeUser from LoginUser controller
  };

  const logout = async () => {
    await LogoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
