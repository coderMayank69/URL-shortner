import express from "express";
import { getAllUserUrls } from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/url/user  — list all URLs belonging to the current user
router.get("/user", authMiddleware, getAllUserUrls);

export default router;