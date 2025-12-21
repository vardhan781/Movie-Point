import React, { useContext } from "react";
import { MovieContext } from "../../Context/MovieContext";
import { User, RefreshCcw, Bookmark } from "lucide-react";
import "./WatchList.css";

const WatchList = () => {
  const { auth, watchlist, toggleWatchlist, fetchWatchlist } =
    useContext(MovieContext);

  if (!auth.isAuthenticated) {
    return (
      <div className="watchlist-empty">
        <h2>Please login to view your watchlist</h2>
      </div>
    );
  }

  return (
    <div className="watchlist-page">
      <div className="watchlist-header">
        <div className="user-info">
          <div className="user-avatar">
            <User size={26} />
          </div>
          <div>
            <h2>{auth.user?.username}</h2>
            <p>Your Watchlist</p>
          </div>
        </div>

        <button
          className="refresh-btn"
          title="Refresh Watchlist"
          onClick={fetchWatchlist}
        >
          <RefreshCcw size={18} />
        </button>
      </div>

      {watchlist.length === 0 ? (
        <div className="watchlist-empty">
          <h3>No movies in watchlist 🎬</h3>
          <p>Add movies to see them here</p>
        </div>
      ) : (
        <div className="watchlist-grid">
          {watchlist.map((movie) => (
            <div className="watchlist-card" key={movie._id}>
              <img
                src={movie.image}
                alt={movie.name}
              />

              <div className="watchlist-card-info">
                <h4>{movie.name}</h4>

                <button
                  className="toggle-btn active"
                  onClick={async () => {
                    await toggleWatchlist(movie._id);
                    fetchWatchlist();
                  }}
                >
                  <Bookmark size={16} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchList;
