import express from "express";
import upload from "../middleware/multer.js";
import {
  addMovie,
  deleteMovie,
  getAllMovies,
  updateMovie,
} from "../controller/movieController.js";
import adminAuth from "../middleware/adminAuth.js";

const movieRoute = express.Router();

movieRoute.post("/add", adminAuth, upload.single("image"), addMovie);
movieRoute.get("/all", getAllMovies);
movieRoute.delete("/:id", adminAuth, deleteMovie);
movieRoute.put("/update/:id", adminAuth, upload.single("image") ,updateMovie);

export default movieRoute;
