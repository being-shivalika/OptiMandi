import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  // Ensure your .env file has VITE_BACKEND_URL=http://localhost:8080
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null); // Changed false to null (cleaner for objects)

  const getUserData = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(`${backendURL}/api/user/data`, {
        headers: {
          Authorization: token,
        },
      });
      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error("Failed to fetch user data");
      }
    } catch (error) {
      toast.error("Error fetching user data:", error);
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

  return (
    /* FIXED: Changed {{ value }} to {value} */
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
