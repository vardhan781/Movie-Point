import { createContext, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const api = import.meta.env.VITE_BACKEND_URL;

  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken") || ""
  );

  const loginAdmin = async (email, password) => {
    try {
      const res = await axios.post(`${api}/api/admin/login`, {
        email,
        password,
      });

      if (res.data.success) {
        setAdminToken(res.data.token);
        localStorage.setItem("adminToken", res.data.token);
        return { success: true };
      } else {
        return {
          success: false,
          message: res.data.message || "Invalid credentials",
        };
      }
    } catch (err) {
      return {
        success: false,
        message: err?.response?.data?.message || "Unable to reach server",
      };
    }
  };

  const value = {
    api,
    adminToken,
    setAdminToken,
    loginAdmin,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
