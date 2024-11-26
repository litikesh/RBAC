import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { getAuthToken, setAuthToken, removeAuthToken } from "../utils/auth";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      const token = getAuthToken();

      if (token) {
        try {
          const response = await axios.get("http://localhost:5000/api/auth/validate-token", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser({ isAuthenticated: true, ...response.data.user });
        } catch (error) {
          console.error("Token validation failed:", error.response?.data?.message);
          logoutUser(); 
        }
      }
      setLoading(false);
    };

    initializeUser();
  }, []);

  const loginUser = (token, userInfo) => {
    setAuthToken(token);
    setUser({
      isAuthenticated: true,
      ...userInfo,
    });
  };

  const RegisterUser = (token, userInfo) => {
    setAuthToken(token);
    setUser({
      isAuthenticated: true,
      ...userInfo,
    });
  };

  const logoutUser = () => {
    removeAuthToken();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, loginUser, RegisterUser, logoutUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
