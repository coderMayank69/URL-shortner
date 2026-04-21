import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import short_url from "./src/routes/short_url.route.js";
import user_routes from "./src/routes/user.routes.js";
import auth_routes from "./src/routes/auth.routes.js";
import analytics_routes from "./src/routes/analytics.routes.js";
import { redirectFromShortUrl } from "./src/controller/short_url.controller.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import { attachUser } from "./src/utils/attachUser.js";
import { startAnalyticsWorker } from "./src/queue/analytics.worker.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isVercel = process.env.VERCEL === "1";
const normalizeOrigin = (value = "") => value.trim().replace(/\/+$/, "");
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    const normalizedOrigin = normalizeOrigin(origin || "");
    if (!origin || allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }
    console.warn(`[CORS] Blocked origin: ${origin}. Allowed: ${allowedOrigins.join(", ")}`);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev")); // Request logging: GET /api/... 200 12ms

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Attach user to request if JWT cookie is present (non-blocking)
app.use(attachUser);

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use("/api/auth", auth_routes);
app.use("/api/url", short_url);
app.use("/api/url", user_routes);        // GET /api/url/user
app.use("/api/analytics", analytics_routes);

// Short URL redirect — must be last to avoid catching API routes
app.get("/:id", redirectFromShortUrl);

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

export default app;

// ─── Start Server ─────────────────────────────────────────────────────────────
if (!isVercel) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);

    // Start BullMQ analytics worker only in non-serverless environments.
    startAnalyticsWorker();

    // Note: Prisma connects lazily on first query — no explicit connect needed
  });
}
