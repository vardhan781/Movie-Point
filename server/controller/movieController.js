import movieModel from "../model/movieModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Add Movie
export const addMovie = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "movies",
      resource_type: "image",
    });

    fs.unlinkSync(req.file.path);

    const castArray = req.body.cast
      ? req.body.cast.split(",").map((actor) => actor.trim())
      : [];

    req.body.imdbRating = Number(req.body.imdbRating);

    const movie = new movieModel({
      image: result.secure_url,
      name: req.body.name,
      description: req.body.description,
      cast: castArray,
      director: req.body.director,
      imdbRating: req.body.imdbRating,
      trailer: req.body.trailer,
    });

    await movie.save();

    res.status(201).json({
      success: true,
      message: "Movie added successfully",
      movie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// Get Movies
export const getAllMovies = async (req, res) => {
  try {
    const movies = await movieModel.find();
    res.status(200).json({
      success: true,
      count: movies.length,
      movies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// Delete Movie
export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await movieModel.findById(id);

    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }

    const publicId = movie.image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`movies/${publicId}`);

    await movieModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// Update Movie
export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await movieModel.findById(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Handle image update
    if (req.file) {
      // Delete old image
      const publicId = movie.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`movies/${publicId}`);

      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "movies",
        resource_type: "image",
      });

      fs.unlinkSync(req.file.path);
      movie.image = result.secure_url;
    }

    // Update other fields
    movie.name = req.body.name || movie.name;
    movie.description = req.body.description || movie.description;
    movie.cast = req.body.cast
      ? req.body.cast.split(",").map((actor) => actor.trim())
      : movie.cast;
    movie.director = req.body.director || movie.director;
    movie.imdbRating = req.body.imdbRating || movie.imdbRating;
    movie.trailer = req.body.trailer || movie.trailer;

    await movie.save();

    return res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      movie,
    });
  } catch (error) {
    console.error("Update Movie Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Add Review
export const addReview = async (req, res) => {
  try {
    const { id } = req.params; // movie ID
    const { stars, comment } = req.body;
    const userId = req.user.id;
    const username = req.user.username;

    if (!stars || !comment) {
      return res
        .status(400)
        .json({ message: "Stars and comment are required" });
    }

    if (stars < 1 || stars > 5) {
      return res.status(400).json({ message: "Stars must be between 1 and 5" });
    }

    if (comment.length > 500) {
      return res
        .status(400)
        .json({ message: "Comment too long (max 500 chars)" });
    }

    const movie = await movieModel.findById(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const alreadyReviewed = movie.reviews.find(
      (r) => r.userId.toString() === userId
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You have already reviewed this movie",
      });
    }

    movie.reviews.push({ userId, username, stars, comment });

    movie.averageRating =
      movie.reviews.reduce((sum, r) => sum + r.stars, 0) / movie.reviews.length;

    await movie.save();

    res.status(201).json({ message: "Review added", reviews: movie.reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Review
export const deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const userId = req.user.id;

    const movie = await movieModel.findById(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const review = movie.reviews.id(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    movie.reviews.pull(reviewId);

    movie.averageRating =
      movie.reviews.length === 0
        ? 0
        : movie.reviews.reduce((sum, r) => sum + r.stars, 0) /
          movie.reviews.length;

    await movie.save();

    res
      .status(200)
      .json({ message: "Review deleted successfully", reviews: movie.reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Movie Details with Reviews
export const getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await movieModel.findById(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    res.status(200).json({ movie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
