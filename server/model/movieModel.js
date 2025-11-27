import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, maxLength: 1000 },
  cast: [{ type: String, required: true }],
  director: { type: String, required: true },
  imdbRating: { type: Number, min: 0, max: 10, required: true },
  trailer: {
    type: String,
    required: false,
    validate: {
      validator: function (v) {
        return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/.test(v);
      },
      message: "Trailer must be a valid YouTube URL",
    },
  },
});

const movieModel =
  mongoose.models.Movie || mongoose.model("Movie", movieSchema);

export default movieModel;
