import express from "express";
import upload from "../middleware/multer.js";
import {
  addMovie,
  deleteMovie,
  getAllMovies,
  updateMovie,
  addReview,
  deleteReview,
  getMovieDetails,
} from "../controller/movieController.js";

import adminAuth from "../middleware/adminAuth.js";
import auth from "../middleware/auth.js";

const movieRoute = express.Router();

movieRoute.post("/add", adminAuth, upload.single("image"), addMovie);
movieRoute.put("/update/:id", adminAuth, upload.single("image"), updateMovie);
movieRoute.delete("/:id", adminAuth, deleteMovie);
movieRoute.get("/all", getAllMovies);
movieRoute.get("/:id", getMovieDetails);
movieRoute.post("/:id/review", auth, addReview);
movieRoute.delete("/:id/review/:reviewId", auth, deleteReview);

export default movieRoute;
