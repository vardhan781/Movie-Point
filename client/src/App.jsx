import React from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import OtpVerify from "./pages/OtpVerify/OtpVerify";
import MoviePage from "./pages/MoviePage/MoviePage";
import WatchList from "./pages/WatchList/WatchList";
import Footer from "./components/Footer/Footer";

const App = () => {
  const location = useLocation();
  const hideLayout =
    location.pathname.startsWith("/auth") ||
    location.pathname.startsWith("/otp-verify");

  return (
    <>
      <Toaster />
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/auth" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/otp-verify" element={<OtpVerify />} />
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="/watchlist" element={<WatchList />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
};

export default App;
