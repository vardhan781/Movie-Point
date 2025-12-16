import express from "express";
import {
  loginUser,
  registerUser,
  resendOTP,
  verifyOTP,
} from "../controller/userController.js";
import auth from "../middleware/auth.js";
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
  toggleWatchlist,
} from "../controller/watchlistController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/verify-otp", verifyOTP);
userRouter.post("/resend-otp", resendOTP);
userRouter.post("/login", loginUser);
userRouter.get("/watchlist", auth, getWatchlist);
userRouter.post("/watchlist/:movieId", auth, addToWatchlist);
userRouter.delete("/watchlist/:movieId", auth, removeFromWatchlist);
userRouter.post("/watchlist/toggle/:movieId", auth, toggleWatchlist);

export default userRouter;
