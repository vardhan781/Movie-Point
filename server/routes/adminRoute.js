import express from "express";
import { loginAdmin } from "../controller/adminController.js";

const adminRoute = express.Router();
adminRoute.post("/login", loginAdmin);

export default adminRoute;
