import { useState, useContext } from "react";
import { LogOut, LogIn, Bookmark } from "lucide-react";
import { MovieContext } from "../../Context/MovieContext";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const { auth, logout } = useContext(MovieContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <nav className="navbar">
        <h1 className="logo" onClick={() => navigate("/")}>
          MoviePoint
        </h1>

        <div className="nav-actions">
          {auth.isAuthenticated && (
            <button
              className="nav-btn watchlist"
              onClick={() => navigate("/watchlist")}
            >
              <Bookmark size={18} />
              Watchlist
            </button>
          )}

          {auth.isAuthenticated ? (
            <button
              className="nav-btn logout"
              onClick={() => setShowModal(true)}
            >
              <LogOut size={18} />
              Logout
            </button>
          ) : (
            <button
              className="nav-btn login"
              onClick={() => navigate("/auth")}
            >
              <LogIn size={18} />
              Login
            </button>
          )}
        </div>
      </nav>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>

            <div className="modal-actions">
              <button
                className="cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="confirm"
                onClick={() => {
                  logout();
                  setShowModal(false);
                  navigate("/auth");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
