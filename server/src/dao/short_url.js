import prisma from "../config/prisma.client.js";
import redis from "../config/redis.client.js";
import { ConflictError } from "../utils/errorHandler.js";

const CACHE_TTL = 86400; // 24 hours in seconds
const cacheKey = (shortCode) => `url:${shortCode}`;

/**
 * Save a new short URL to PostgreSQL.
 * Throws ConflictError if shortCode already exists.
 */
export const saveShortUrl = async (shortCode, originalUrl, userId = null, expiresAt = null) => {
  try {
    return await prisma.url.create({
      data: {
        shortCode,
        originalUrl,
        userId: userId ? Number(userId) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });
  } catch (err) {
    // Prisma unique constraint violation code
    if (err.code === "P2002") {
      throw new ConflictError("Short URL already exists");
    }
    throw err;
  }
};

/**
 * Cache-aside lookup for redirect.
 * 1. Check Redis  → HIT: return immediately (sub-ms)
 * 2. Cache MISS   → query PostgreSQL
 * 3. Store in Redis with TTL
 * Returns: { id, originalUrl, shortCode, ... } | null
 */
export const getShortUrl = async (shortCode) => {
  const key = cacheKey(shortCode);

  try {
    // 1. Redis cache check
    const cached = await redis.get(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      console.log(`[Cache] HIT  → ${shortCode}`);
      return parsed;
    }
  } catch (redisErr) {
    // Redis failure shouldn't block the redirect
    console.error("[Cache] Redis read error:", redisErr.message);
  }

  // 2. DB lookup
  const url = await prisma.url.findUnique({ where: { shortCode } });
  if (!url) return null;

  // 3. Check expiry
  if (url.expiresAt && url.expiresAt < new Date()) {
    return null; // Treat expired URL as not found
  }

  // 4. Populate cache
  try {
    await redis.setex(key, CACHE_TTL, JSON.stringify(url));
    console.log(`[Cache] MISS → ${shortCode} (cached for 24h)`);
  } catch (redisErr) {
    console.error("[Cache] Redis write error:", redisErr.message);
  }

  return url;
};

/**
 * Check if a custom slug already exists.
 */
export const getCustomShortUrl = async (slug) => {
  return await prisma.url.findUnique({ where: { shortCode: slug } });
};

/**
 * Delete a short URL from DB and invalidate its Redis cache.
 */
export const deleteShortUrl = async (shortCode, userId) => {
  // Verify ownership before delete
  const url = await prisma.url.findUnique({ where: { shortCode } });
  if (!url) return null;
  if (url.userId && url.userId !== Number(userId)) {
    throw new Error("Not authorised to delete this URL");
  }

  await prisma.url.delete({ where: { shortCode } });

  // Invalidate cache
  try {
    await redis.del(cacheKey(shortCode));
    console.log(`[Cache] Invalidated → ${shortCode}`);
  } catch (redisErr) {
    console.error("[Cache] Redis invalidation error:", redisErr.message);
  }

  return true;
};