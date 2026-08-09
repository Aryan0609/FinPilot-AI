import { createContext, useCallback, useEffect, useState } from "react";
import authService from "../services/authService";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await authService.getCurrentUser();

      setUser(response.data);
    } catch (error) {
      console.error("Failed to restore authenticated user:", error);

      /*
       * Only clear authentication when the server explicitly
       * rejects the token.
       *
       * This prevents temporary API/network problems from
       * unnecessarily logging the user out.
       */
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const response = await authService.login({
      email,
      password,
    });

    const token = response.data?.token;

    if (!token) {
      throw new Error("Login succeeded but no authentication token was returned.");
    }

    localStorage.setItem("token", token);

    try {
      const currentUser = await authService.getCurrentUser();

      setUser(currentUser.data);

      return currentUser.data;
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
      throw error;
    }
  };

  const register = async (data) => {
    return authService.register(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        setUser,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
