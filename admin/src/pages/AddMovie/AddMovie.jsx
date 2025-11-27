import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";
import toast from "react-hot-toast";
import "./AddMovie.css";

const AddMovie = () => {
  const { api, adminToken } = useContext(UserContext);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cast: "",
    director: "",
    imdbRating: "",
    trailer: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return toast.error("Poster image is required");

    setSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach(
      (key) => formData[key] && data.append(key, formData[key])
    );
    data.append("image", image);

    try {
      await axios.post(`${api}/api/movies/add`, data, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Movie added successfully!");
      setFormData({
        name: "",
        description: "",
        cast: "",
        director: "",
        imdbRating: "",
        trailer: "",
      });
      setImage(null);
      setImagePreview(null);
      e.target.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add movie");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-page">
      <div className="add-header">
        <h2>Add New Movie</h2>
        <p>Fill in the details to add a movie to your collection</p>
      </div>

      <form onSubmit={handleSubmit} className="add-form">
        <div className="form-grid">
          <div className="form-col">
            <div className="field">
              <label>
                Movie Title <span className="req">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Inception"
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
                value={formData.description}
                onChange={handleChange}
                placeholder="A thief who steals corporate secrets through dream-sharing technology..."
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
                value={formData.cast}
                onChange={handleChange}
                placeholder="Leonardo DiCaprio, Ken Watanabe, Joseph Gordon-Levitt"
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
                value={formData.director}
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
                value={formData.imdbRating}
                onChange={handleChange}
                placeholder="8.8"
                required
              />
            </div>

            <div className="field">
              <label>Trailer URL</label>
              <input
                type="url"
                name="trailer"
                value={formData.trailer}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <small>YouTube only</small>
            </div>

            <div className="field">
              <label>
                Movie Poster <span className="req">*</span>
              </label>
              <input
                type="file"
                id="poster"
                accept="image/*"
                onChange={handleImage}
                required
              />
              <label htmlFor="poster" className="upload-btn">
                {image ? "Change Poster" : "Select Poster"}
              </label>

              {imagePreview && (
                <div className="preview-box">
                  <img
                    src={imagePreview}
                    alt="Poster preview"
                    className="poster-preview-img"
                  />
                  <div className="preview-label">Preview</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="submit-area">
          <button type="submit" className="add-btn" disabled={submitting}>
            {submitting ? <span className="btn-spinner"></span> : "Add Movie"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMovie;
