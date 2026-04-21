import wrapAsync from "../utils/tryCatchWrapper.js";
import { getAllUserUrlsDao } from "../dao/user.dao.js";

/**
 * GET /api/url/user
 * Returns all URLs belonging to the currently authenticated user.
 */
export const getAllUserUrls = wrapAsync(async (req, res) => {
  const urls = await getAllUserUrlsDao(req.user.id); // use integer id, not _id
  res.status(200).json({ message: "success", urls });
});