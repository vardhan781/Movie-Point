import express from "express";
import cors from "cors";
import "dotenv/config";
import dB from "./config/dB.js";
import connectCloudinary from "./config/cloudinary.js";
import movieRoute from "./routes/movieRoute.js";
import adminRoute from "./routes/adminRoute.js";
import userRouter from "./routes/userRoute.js";

const app = express();
const PORT = process.env.PORT || 7000;

dB();
connectCloudinary();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/movies", movieRoute);
app.use("/api/admin", adminRoute);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(PORT, () => console.log("Server is running on " + PORT));
