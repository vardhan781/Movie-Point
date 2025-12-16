import userModel from "../model/usermodel.js";
import movieModel from "../model/movieModel.js";

export const getWatchlist = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).populate("watchlist");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      watchlist: user.watchlist,
    });
  } catch (error) {
    console.error("Get Watchlist Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const addToWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params;

    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const movie = await movieModel.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const alreadyAdded = user.watchlist.some((id) => id.toString() === movieId);

    if (alreadyAdded) {
      return res.status(400).json({
        message: "Movie already in watchlist",
      });
    }

    user.watchlist.push(movieId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Added to watchlist",
      watchlist: user.watchlist,
    });
  } catch (error) {
    console.error("Add Watchlist Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const removeFromWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params;

    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const exists = user.watchlist.some((id) => id.toString() === movieId);

    if (!exists) {
      return res.status(404).json({
        message: "Movie not found in watchlist",
      });
    }

    user.watchlist.pull(movieId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Removed from watchlist",
      watchlist: user.watchlist,
    });
  } catch (error) {
    console.error("Remove Watchlist Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const toggleWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params;

    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const exists = user.watchlist.find((id) => id.toString() === movieId);

    if (exists) {
      user.watchlist.pull(movieId);
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Removed from watchlist",
        inWatchlist: false,
      });
    }

    user.watchlist.push(movieId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Added to watchlist",
      inWatchlist: true,
    });
  } catch (error) {
    console.error("Toggle Watchlist Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
