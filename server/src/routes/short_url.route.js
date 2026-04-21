import express from "express";
import { createShortUrl, removeShortUrl } from "../controller/short_url.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// POST /api/url/shorten  — create short URL (auth optional, enables custom slugs)
router.post("/shorten", createShortUrl);

// GET /api/url/user  — get all URLs for current user (auth required)
// Note: handled in user.routes.js

// DELETE /api/url/:shortCode — delete a short URL (auth required, owner only)
router.delete("/:shortCode", authMiddleware, removeShortUrl);

export default router;