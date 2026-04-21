import { findUserById } from "../dao/user.dao.js";
import { verifyToken } from "../utils/helper.js";

/**
 * Auth middleware — requires a valid JWT cookie.
 * Returns 401 if missing or invalid.
 */
export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized — please log in" });
  }

  try {
    const userId = verifyToken(token); // returns the integer user id
    const user = await findUserById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized — user not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized — invalid or expired token" });
  }
};