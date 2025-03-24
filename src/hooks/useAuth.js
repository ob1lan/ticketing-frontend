import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ username: decoded.username, role: decoded.role });
      } catch (err) {
        console.error("Failed to decode token", err);
        setUser(null);
      }
    }
  }, []);

  return user;
};
