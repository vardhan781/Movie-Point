import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./Dashboard.css";

const Dashboard = () => {
  const { api, adminToken } = useContext(UserContext);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    movieId: null,
    movieName: "",
  });

  const fetchMovies = async () => {
    try {
      const res = await axios.get(`${api}/api/movies/all`);
      setMovies(res.data.movies || []);
    } catch (err) {
      toast.error("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id, name) => {
    setDeleteModal({ isOpen: true, movieId: id, movieName: name });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, movieId: null, movieName: "" });
  };

  const confirmDelete = async () => {
    if (!deleteModal.movieId) return;

    setDeletingId(deleteModal.movieId);

    try {
      await axios.delete(`${api}/api/movies/${deleteModal.movieId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      toast.success(`"${deleteModal.movieName}" deleted`);
      fetchMovies();
      closeDeleteModal();
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="full-screen-loading">
        <div className="netflix-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div>
          <h2>Movie Collection</h2>
          <span className="count">{movies.length} movies</span>
        </div>
        <Link to="/admin/add-movie" className="add-btn">
          + Add Movie
        </Link>
      </div>

      {movies.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎬</div>
          <h3>No movies added yet</h3>
          <p>
            Your movie collection is empty. Start by adding your first movie.
          </p>
          <Link to="/admin/add-movie" className="add-btn">
            + Add Your First Movie
          </Link>
        </div>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <div key={movie._id} className="movie-card">
              <div className="poster-wrapper">
                <img src={movie.image} alt={movie.name} className="poster" />

                <div className="kebab-menu">
                  <button
                    className="kebab-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      const dropdown = e.currentTarget.nextElementSibling;
                      const isOpen = dropdown.classList.contains("open");

                      document
                        .querySelectorAll(".menu-dropdown")
                        .forEach((d) => d.classList.remove("open"));

                      if (!isOpen) dropdown.classList.add("open");
                    }}
                  >
                    ⋮
                  </button>

                  <div className="menu-dropdown">
                    <Link
                      to={`/admin/edit/${movie._id}`}
                      className="menu-item"
                      onClick={() =>
                        document
                          .querySelectorAll(".menu-dropdown")
                          .forEach((d) => d.classList.remove("open"))
                      }
                    >
                      Edit
                    </Link>
                    <button
                      className="menu-item delete"
                      onClick={() => {
                        openDeleteModal(movie._id, movie.name);
                        document
                          .querySelectorAll(".menu-dropdown")
                          .forEach((d) => d.classList.remove("open"));
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              <div className="movie-details">
                <h3 className="movie-title">{movie.name}</h3>
                <p className="movie-info">
                  {movie.year} {movie.genre && <>• {movie.genre}</>}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteModal.isOpen && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Movie</h3>
            <p>
              Delete <strong>"{deleteModal.movieName}"</strong> permanently?
            </p>
            <p className="warning">This cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button className="btn-delete" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
