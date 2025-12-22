import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MovieContext } from "../../Context/MovieContext";
import toast from "react-hot-toast";
import {
  Star,
  Play,
  Calendar,
  Users,
  Film,
  Clock,
  MessageSquare,
  Heart,
} from "lucide-react";
import "./MoviePage.css";

const MoviePage = () => {
  const { id } = useParams();
  const { backendUrl, auth ,watchlist, toggleWatchlist} = useContext(MovieContext);
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewForm, setReviewForm] = useState({ stars: 0, comment: "" });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    reviewId: null,
    username: "",
  });

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/movies/${id}`);
      setMovie(res.data.movie);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch movie");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const isInWatchlist =
    movie && watchlist.some((m) => m._id === movie._id);

  const handleWatchlist = () => {
    if (!auth.isAuthenticated) {
      toast.error("Login to manage watchlist");
      navigate("/auth");
      return;
    }
    toggleWatchlist(movie._id);
  };

  const handleAddReview = async () => {
    if (!auth.isAuthenticated) return toast.error("Login first!");
    if (!reviewForm.stars || !reviewForm.comment)
      return toast.error("Fill all fields");

    try {
      await axios.post(`${backendUrl}/api/movies/${id}/review`, reviewForm, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      toast.success("Review added!");
      setReviewForm({ stars: 0, comment: "" });
      fetchMovie();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add review");
    }
  };

  const openDeleteModal = (reviewId, username) => {
    setDeleteModal({
      isOpen: true,
      reviewId,
      username,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, reviewId: null, username: "" });
  };

  const confirmDeleteReview = async () => {
    if (!deleteModal.reviewId) return;

    try {
      await axios.delete(
        `${backendUrl}/api/movies/${id}/review/${deleteModal.reviewId}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      toast.success("Review deleted!");
      fetchMovie();
      closeDeleteModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete review");
    }
  };

  const goToAuth = () => {
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="movie-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3>Loading Movie Details</h3>
          <p>Fetching information from our database...</p>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-error">
        <div className="error-container">
          <Film size={48} className="error-icon" />
          <h3>Unable to Load Movie</h3>
          <p className="error-message">{error}</p>
          <div className="error-actions">
            <button onClick={() => window.history.back()} className="back-btn">
              Go Back
            </button>
            <button onClick={fetchMovie} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="movie-page">
      <div className="movie-hero">
        <div className="hero-content">
          <div className="poster-section">
            <div className="poster-container">
              <img
                src={movie.image}
                alt={movie.name}
                className="movie-poster"
              />
              <button
                className={`watchlist-btn ${
                  isInWatchlist ? "active" : ""
                }`}
                onClick={handleWatchlist}
              >
                <Heart
                  size={18}
                  fill={isInWatchlist ? "#e50914" : "none"}
                />
              </button>
              <div className="poster-overlay">
                {movie.trailer && (
                  <a
                    href={movie.trailer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="trailer-btn"
                  >
                    <Play size={20} />
                    <span>Watch Trailer</span>
                  </a>
                )}
              </div>
            </div>

            <div className="movie-stats">
              <div className="stat-item">
                <Star size={18} className="stat-icon" />
                <div>
                  <span className="stat-value">{movie.imdbRating}</span>
                  <span className="stat-label">/10 IMDb</span>
                </div>
              </div>
              {movie.year && (
                <div className="stat-item">
                  <Calendar size={18} className="stat-icon" />
                  <div>
                    <span className="stat-value">{movie.year}</span>
                    <span className="stat-label">Year</span>
                  </div>
                </div>
              )}
              {movie.runtime && (
                <div className="stat-item">
                  <Clock size={18} className="stat-icon" />
                  <div>
                    <span className="stat-value">{movie.runtime}</span>
                    <span className="stat-label">minutes</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="movie-details">
            <div className="movie-header">
              <h1>{movie.name}</h1>
              {movie.genre && (
                <div className="genre-tags">
                  {movie.genre.split(",").map((genre, idx) => (
                    <span key={idx} className="genre-tag">
                      {genre.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <p className="movie-description">{movie.description}</p>

            <div className="movie-info-section">
              <div className="info-card">
                <h3>
                  <Users size={18} />
                  Cast & Crew
                </h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Director</span>
                    <span className="info-value">{movie.director}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Cast</span>
                    <span className="info-value cast-value">
                      {Array.isArray(movie.cast)
                        ? movie.cast.join(", ")
                        : movie.cast}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <div className="section-header">
          <MessageSquare size={24} />
          <h2>
            User Reviews{" "}
            <span className="review-count">({movie.reviews?.length || 0})</span>
          </h2>
        </div>

        {movie.reviews?.length > 0 ? (
          <div className="reviews-grid">
            {movie.reviews.map((r) => (
              <div key={r._id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="avatar">
                      {r.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="reviewer-name">{r.username}</span>
                      <div className="review-meta">
                        <span className="review-date">
                          {new Date(r.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="review-rating">
                    <div className="star-display">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < r.stars ? "#e50914" : "none"}
                          color={i < r.stars ? "#e50914" : "#555"}
                        />
                      ))}
                    </div>
                    <span className="rating-value">{r.stars}.0</span>
                  </div>
                </div>
                <p className="review-content">{r.comment}</p>
                {auth.user?.id === r.userId?.toString() && (
                  <div className="review-actions">
                    <button
                      className="delete-review-btn"
                      onClick={() => openDeleteModal(r._id, r.username)}
                    >
                      Delete Review
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-reviews">
            <MessageSquare size={48} />
            <h3>No Reviews Yet</h3>
            <p>Be the first to share your thoughts about this movie!</p>
          </div>
        )}

        <div className="review-form-section">
          {auth.isAuthenticated ? (
            <div className="add-review-form">
              <h3>Share Your Review</h3>
              <div className="rating-selector">
                <span className="rating-label">Your Rating</span>
                <div className="stars-selector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={28}
                      className={`star-option ${
                        star <= reviewForm.stars ? "active" : ""
                      }`}
                      onClick={() =>
                        setReviewForm({ ...reviewForm, stars: star })
                      }
                    />
                  ))}
                  <span className="selected-rating">
                    {reviewForm.stars} / 5
                  </span>
                </div>
              </div>
              <div className="review-input">
                <textarea
                  placeholder="Share your thoughts about the movie (minimum 50 characters)..."
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, comment: e.target.value })
                  }
                  rows={5}
                  minLength={50}
                />
                <div className="char-count">
                  {reviewForm.comment.length} / 300 characters
                </div>
              </div>
              <div className="form-actions">
                <button
                  onClick={() => setReviewForm({ stars: 0, comment: "" })}
                  className="clear-btn"
                >
                  Clear
                </button>
                <button
                  onClick={handleAddReview}
                  className="submit-review-btn"
                  disabled={
                    reviewForm.stars === 0 || reviewForm.comment.length < 10
                  }
                >
                  Submit Review
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-prompt">
              <div className="auth-content">
                <MessageSquare size={32} />
                <h3>Want to share your thoughts?</h3>
                <p>Join our community to rate and review movies.</p>
                <button className="auth-action-btn" onClick={goToAuth}>
                  Login to Review
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {deleteModal.isOpen && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Review</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this review?</p>
              <div className="review-preview">
                <span className="preview-username">{deleteModal.username}</span>
                <p>This action cannot be undone.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button className="btn-danger" onClick={confirmDeleteReview}>
                Delete Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviePage;
