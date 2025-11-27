import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import AddMovie from "./pages/AddMovie/AddMovie";
import EditMovie from "./pages/EditMovies/EditMovies";
import { UserContext } from "./Context/UserContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { adminToken } = useContext(UserContext);

  return (
    <>
      <Toaster />
      {adminToken && <Navbar />}
      <Routes>
        {!adminToken && <Route path="/" element={<Login />} />}
        {!adminToken && <Route path="/*" element={<Navigate to="/" />} />}

        {adminToken && (
          <>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/add-movie" element={<AddMovie />} />
            <Route path="/admin/edit/:id" element={<EditMovie />} />
            <Route path="/*" element={<Navigate to="/admin/dashboard" />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default App;
