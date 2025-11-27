import React, { useContext, useState } from "react";
import { UserContext } from "../../Context/UserContext";
import "./Navbar.css";

const Navbar = () => {
  const { setAdminToken } = useContext(UserContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setAdminToken("");
    window.location.href = "/admin/login";
  };

  return (
    <>
      <div className="top-navbar">
        <div className="navbar-left">
          <h1 className="logo">MoviePoint</h1>
          <span className="subtitle">Admin Panel</span>
        </div>

        <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
          Logout
        </button>
      </div>

      {showLogoutModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowLogoutModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Log out?</h3>
            <p>Are you sure you want to end your session?</p>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowLogoutModal(false)}
              >
                Stay
              </button>
              <button className="btn-logout" onClick={handleLogout}>
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
