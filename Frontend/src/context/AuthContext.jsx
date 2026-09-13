import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  // Dynamically switch backend URL based on environment
  const backendURL = import.meta.env.VITE_BACKEND_URL || (window.location.hostname === "localhost" ? "http://localhost:8080" : "https://optimandi-1.onrender.com");

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);

  // ================= GET USER DATA =================
  const getUserData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoggedin(false);
        setUserData(null);
        return;
      }

      const { data } = await axios.get(
        `${backendURL}/api/auth/user/data`, // ✅ fixed route
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ fixed token format
          },
        },
      );

      if (data.success) {
        setUserData(data.user);
        setIsLoggedin(true);
      } else {
        setUserData(null);
        setIsLoggedin(false);
        toast.error("Failed to fetch user data");
      }
    } catch (error) {
      setUserData(null);
      setIsLoggedin(false);
      toast.error(error.response?.data?.message || "Error fetching user data");
    }
  };

  const value = {
    backendURL,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
