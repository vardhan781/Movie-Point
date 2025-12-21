import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { MovieContext } from "../../Context/MovieContext";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { backendUrl } = useContext(MovieContext);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backendUrl}/api/movies/all`);
        setMovies(res.data.movies);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>Loading movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-error">
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-grid">
        {movies.map((movie) => (
          <div
            key={movie._id}
            className="home-movie-card"
            onClick={() => navigate(`/movie/${movie._id}`)}
          >
            <div className="home-poster-container">
              <img
                src={movie.image}
                alt={movie.name}
                className="home-poster"
                loading="lazy"
              />
            </div>
            <h3 className="home-title">{movie.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
