import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../../Context/UserContext";
import "./EditMovies.css";

const EditMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api, adminToken } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchMovie = async () => {
    try {
      const res = await axios.get(`${api}/api/movies/all`);
      const found = res.data.movies.find((m) => m._id === id);

      if (!found) {
        toast.error("Movie not found");
        return navigate("/admin/dashboard");
      }

      const movieData = {
        name: found.name || "",
        description: found.description || "",
        cast: found.cast?.join(", ") || "",
        director: found.director || "",
        imdbRating: found.imdbRating || "",
        trailer: found.trailer || "",
      };

      setMovie(movieData);
      setImagePreview(found.image);
    } catch (err) {
      toast.error("Failed to load movie");
      navigate("/admin/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    Object.keys(movie).forEach(
      (key) => movie[key] && formData.append(key, movie[key])
    );
    if (newImage) formData.append("image", newImage);

    try {
      await axios.put(`${api}/api/movies/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Movie updated successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="full-screen-loading">
        <div className="netflix-spinner"></div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="edit-page">
      <div className="edit-header">
        <h2>Edit Movie</h2>
        <p>Update the movie details below</p>
      </div>

      <form onSubmit={handleUpdate} className="edit-form">
        <div className="form-grid">
          <div className="form-col">
            <div className="field">
              <label>
                Movie Title <span className="req">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={movie.name}
                onChange={handleChange}
                placeholder="e.g. The Dark Knight"
                required
              />
            </div>

            <div className="field">
              <label>
                Description <span className="req">*</span>
              </label>
              <textarea
                name="description"
                rows="6"
                value={movie.description}
                onChange={handleChange}
                placeholder="Enter movie description..."
                required
              />
            </div>

            <div className="field">
              <label>
                Cast <span className="req">*</span>
              </label>
              <input
                type="text"
                name="cast"
                value={movie.cast}
                onChange={handleChange}
                placeholder="Christian Bale, Heath Ledger"
                required
              />
              <small>Separate with commas</small>
            </div>
          </div>

          <div className="form-col">
            <div className="field">
              <label>
                Director <span className="req">*</span>
              </label>
              <input
                type="text"
                name="director"
                value={movie.director}
                onChange={handleChange}
                placeholder="Christopher Nolan"
                required
              />
            </div>

            <div className="field">
              <label>
                IMDB Rating <span className="req">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                name="imdbRating"
                value={movie.imdbRating}
                onChange={handleChange}
                placeholder="9.0"
                required
              />
            </div>

            <div className="field">
              <label>Trailer URL</label>
              <input
                type="url"
                name="trailer"
                value={movie.trailer}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <small>YouTube only</small>
            </div>

            <div className="field">
              <label>Poster Image</label>
              <input
                type="file"
                id="poster"
                accept="image/*"
                onChange={handleImage}
              />
              <label htmlFor="poster" className="upload-btn">
                {newImage ? "Change Poster" : "Replace Poster"}
              </label>

              <div className="preview-box">
                <img src={imagePreview} alt="Movie poster" />
                <div className="preview-label">
                  {newImage ? "New poster preview" : "Current poster"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="submit-area">
          <button type="submit" className="save-btn" disabled={submitting}>
            {submitting ? (
              <span className="btn-spinner"></span>
            ) : (
              "Save Changes"
            )}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/admin/dashboard")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMovie;
