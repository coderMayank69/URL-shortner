import { findUserById } from "../dao/user.dao.js";
import { verifyToken } from "./helper.js";

/**
 * attachUser middleware — optionally attaches user to req if JWT cookie is present.
 * Unlike authMiddleware, this does NOT return 401 — it silently passes through.
 * Used on routes that work for both anonymous and authenticated users (e.g. URL creation).
 */
export const attachUser = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return next();

  try {
    const userId = verifyToken(token);
    const user = await findUserById(userId);
    if (user) req.user = user;
  } catch (error) {
    // Invalid token — treat as anonymous, don't block the request
    console.warn("[attachUser] Invalid token:", error.message);
  }

  next();
};