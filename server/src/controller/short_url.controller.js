import { getShortUrl, deleteShortUrl } from "../dao/short_url.js";
import { createShortUrlWithoutUser, createShortUrlWithUser } from "../services/short_url.service.js";
import { addClickJob } from "../queue/analytics.queue.js";
import wrapAsync from "../utils/tryCatchWrapper.js";
import { NotFoundError, UnauthorizedError } from "../utils/errorHandler.js";

/**
 * POST /api/url/shorten
 * Create a short URL. Authenticated users can provide a custom slug + expiry.
 */
export const createShortUrl = wrapAsync(async (req, res) => {
  const { url, slug, expiresAt } = req.body;

  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  let shortCode;
  if (req.user) {
    shortCode = await createShortUrlWithUser(url, req.user.id, slug || null, expiresAt || null);
  } else {
    shortCode = await createShortUrlWithoutUser(url);
  }

  res.status(201).json({ shortUrl: process.env.APP_URL + shortCode, shortCode });
});

/**
 * GET /:shortCode
 * Redirect to original URL. Analytics pushed to BullMQ queue (non-blocking).
 */
export const redirectFromShortUrl = wrapAsync(async (req, res) => {
  const { id: shortCode } = req.params;
  const url = await getShortUrl(shortCode);

  if (!url) throw new NotFoundError("Short URL not found or has expired");

  // Fire-and-forget analytics — does NOT block the redirect
  addClickJob(url.id, req.ip, req.headers["user-agent"]);

  res.redirect(url.originalUrl);
});

/**
 * DELETE /api/url/:shortCode
 * Delete a short URL and invalidate its Redis cache.
 * Only the owner can delete their URL.
 */
export const removeShortUrl = wrapAsync(async (req, res) => {
  if (!req.user) throw new UnauthorizedError("You must be logged in to delete URLs");

  const { shortCode } = req.params;
  const result = await deleteShortUrl(shortCode, req.user.id);

  if (!result) throw new NotFoundError("URL not found");

  res.status(200).json({ message: "URL deleted successfully" });
});