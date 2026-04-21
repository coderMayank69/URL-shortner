import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock Prisma ──────────────────────────────────────────────────────────────
vi.mock("../config/prisma.client.js", () => ({
  default: {
    url: {
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

// ─── Mock Redis ───────────────────────────────────────────────────────────────
vi.mock("../config/redis.client.js", () => ({
  default: {
    get: vi.fn().mockResolvedValue(null),     // default: cache miss
    setex: vi.fn().mockResolvedValue("OK"),
    del: vi.fn().mockResolvedValue(1),
  },
}));

import prisma from "../config/prisma.client.js";
import redis from "../config/redis.client.js";
import { saveShortUrl, getShortUrl, deleteShortUrl } from "../dao/short_url.js";

// ─── Tests ────────────────────────────────────────────────────────────────────
describe("Short URL DAO", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── saveShortUrl ────────────────────────────────────────────────────────────
  describe("saveShortUrl", () => {
    it("creates a URL record in the DB", async () => {
      const mockUrl = { id: 1, shortCode: "abc1234", originalUrl: "https://google.com" };
      prisma.url.create.mockResolvedValue(mockUrl);

      const result = await saveShortUrl("abc1234", "https://google.com");

      expect(prisma.url.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ shortCode: "abc1234", originalUrl: "https://google.com" }),
      });
      expect(result).toEqual(mockUrl);
    });

    it("creates a URL record with userId when provided", async () => {
      const mockUrl = { id: 2, shortCode: "mylink", originalUrl: "https://example.com", userId: 5 };
      prisma.url.create.mockResolvedValue(mockUrl);

      await saveShortUrl("mylink", "https://example.com", 5);

      expect(prisma.url.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ userId: 5 }),
      });
    });

    it("throws ConflictError on duplicate shortCode (Prisma P2002)", async () => {
      const prismaError = new Error("Unique constraint failed");
      prismaError.code = "P2002";
      prisma.url.create.mockRejectedValue(prismaError);

      await expect(saveShortUrl("dup", "https://x.com")).rejects.toThrow("Short URL already exists");
    });
  });

  // ── getShortUrl (cache-aside) ────────────────────────────────────────────────
  describe("getShortUrl", () => {
    it("returns cached URL without hitting DB on cache HIT", async () => {
      const mockUrl = { id: 1, shortCode: "hit123", originalUrl: "https://cached.com" };
      redis.get.mockResolvedValue(JSON.stringify(mockUrl));

      const result = await getShortUrl("hit123");

      expect(result).toEqual(mockUrl);
      expect(prisma.url.findUnique).not.toHaveBeenCalled();
    });

    it("queries DB and caches result on cache MISS", async () => {
      redis.get.mockResolvedValue(null); // cache miss
      const mockUrl = { id: 2, shortCode: "miss123", originalUrl: "https://db.com", expiresAt: null };
      prisma.url.findUnique.mockResolvedValue(mockUrl);

      const result = await getShortUrl("miss123");

      expect(prisma.url.findUnique).toHaveBeenCalledWith({ where: { shortCode: "miss123" } });
      expect(redis.setex).toHaveBeenCalledWith("url:miss123", 86400, JSON.stringify(mockUrl));
      expect(result).toEqual(mockUrl);
    });

    it("returns null when URL not found in DB", async () => {
      redis.get.mockResolvedValue(null);
      prisma.url.findUnique.mockResolvedValue(null);

      const result = await getShortUrl("notfound");

      expect(result).toBeNull();
    });

    it("returns null for expired URLs", async () => {
      redis.get.mockResolvedValue(null);
      prisma.url.findUnique.mockResolvedValue({
        id: 3, shortCode: "expired", originalUrl: "https://old.com",
        expiresAt: new Date("2020-01-01"), // in the past
      });

      const result = await getShortUrl("expired");

      expect(result).toBeNull();
    });
  });

  // ── deleteShortUrl ───────────────────────────────────────────────────────────
  describe("deleteShortUrl", () => {
    it("deletes URL from DB and invalidates Redis cache", async () => {
      prisma.url.findUnique.mockResolvedValue({ id: 1, shortCode: "del123", userId: 99 });
      prisma.url.delete.mockResolvedValue({});

      const result = await deleteShortUrl("del123", 99);

      expect(prisma.url.delete).toHaveBeenCalledWith({ where: { shortCode: "del123" } });
      expect(redis.del).toHaveBeenCalledWith("url:del123");
      expect(result).toBe(true);
    });

    it("throws when trying to delete another user's URL", async () => {
      prisma.url.findUnique.mockResolvedValue({ id: 1, shortCode: "owned", userId: 42 });

      await expect(deleteShortUrl("owned", 99)).rejects.toThrow("Not authorised");
    });
  });
});
