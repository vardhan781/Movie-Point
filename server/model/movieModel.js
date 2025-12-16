import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },

    name: { type: String, required: true, trim: true },

    description: { type: String, required: true, maxLength: 1000 },

    cast: {
      type: [String],
      default: [],
    },

    director: { type: String, required: true },

    imdbRating: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },

    trailer: {
      type: String,
      required: false,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/.test(v);
        },
        message: "Trailer must be a valid YouTube URL",
      },
    },

    reviews: {
      type: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          username: { type: String, required: true },
          stars: { type: Number, min: 1, max: 5, required: true },
          comment: { type: String, required: true, maxLength: 500 },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },

    averageRating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const movieModel =
  mongoose.models.Movie || mongoose.model("Movie", movieSchema);

export default movieModel;
