import { generateNanoId } from "../utils/helper.js";
import { saveShortUrl, getCustomShortUrl } from "../dao/short_url.js";
import { ConflictError } from "../utils/errorHandler.js";

/**
 * Create a short URL for anonymous (non-logged-in) users.
 * Generates a random 7-character code.
 */
export const createShortUrlWithoutUser = async (url) => {
  const shortCode = generateNanoId(7);
  await saveShortUrl(shortCode, url);
  return shortCode;
};

/**
 * Create a short URL for authenticated users.
 * Optionally accepts a custom slug — validates uniqueness first.
 */
export const createShortUrlWithUser = async (url, userId, slug = null, expiresAt = null) => {
  const shortCode = slug || generateNanoId(7);

  if (slug) {
    const exists = await getCustomShortUrl(slug);
    if (exists) throw new ConflictError("This custom slug is already taken");
  }

  await saveShortUrl(shortCode, url, userId, expiresAt);
  return shortCode;
};