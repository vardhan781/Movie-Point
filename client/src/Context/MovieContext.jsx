import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const MovieContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const MovieContextProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    user: JSON.parse(localStorage.getItem("user")),
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
  });

  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (auth.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [auth.token]);

  const login = async ({ email, password }) => {
    try {
      setAuth((prev) => ({ ...prev, loading: true }));

      const res = await axios.post(`${backendUrl}/api/user/login`, {
        email,
        password,
      });

      if (res.data.isVerified === false) {
        setAuth((prev) => ({ ...prev, loading: false }));
        return res.data;
      }

      setAuth({
        token: res.data.token,
        user: res.data.user,
        isAuthenticated: true,
        loading: false,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful 🎬");

      return res.data;
    } catch (err) {
      setAuth((prev) => ({ ...prev, loading: false }));
      toast.error(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  const register = async ({ username, email, password }) => {
    try {
      setAuth((prev) => ({ ...prev, loading: true }));

      const res = await axios.post(`${backendUrl}/api/user/register`, {
        username,
        email,
        password,
      });

      toast.success(res.data.message);
      setAuth((prev) => ({ ...prev, loading: false }));
    } catch (err) {
      setAuth((prev) => ({ ...prev, loading: false }));
      toast.error(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  const logout = () => {
    setAuth({
      token: null,
      user: null,
      isAuthenticated: false,
      loading: false,
    });

    setWatchlist([]);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out");
  };

  const fetchWatchlist = async () => {
    if (!auth.token) return;

    try {
      const res = await axios.get(`${backendUrl}/api/user/watchlist`);
      setWatchlist(res.data.watchlist);
    } catch (error) {
      console.error("Fetch Watchlist Error");
    }
  };

  const toggleWatchlist = async (movieId) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/user/watchlist/toggle/${movieId}`,
      );

      if (res.data.inWatchlist) {
        fetchWatchlist();
      } else {
        setWatchlist((prev) => prev.filter((movie) => movie._id !== movieId));
      }

      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Watchlist failed");
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchWatchlist();
    } else {
      setWatchlist([]);
    }
  }, [auth.isAuthenticated]);

  const value = {
    backendUrl,
    auth,
    login,
    register,
    logout,
    watchlist,
    toggleWatchlist,
    fetchWatchlist,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};
