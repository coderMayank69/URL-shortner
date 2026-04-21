import express from "express";
import { getUrlAnalytics } from "../controller/analytics.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/analytics/:urlId — get analytics for a URL (auth required)
router.get("/:urlId", authMiddleware, getUrlAnalytics);

export default router;
