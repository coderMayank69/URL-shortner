import wrapAsync from "../utils/tryCatchWrapper.js";
import { getDailyBreakdown, getTotalClicks, getUniqueClicks } from "../dao/analytics.dao.js";
import { NotFoundError, UnauthorizedError } from "../utils/errorHandler.js";
import prisma from "../config/prisma.client.js";

/**
 * GET /api/analytics/:urlId
 * Returns analytics for a specific URL.
 * Protected: only the URL owner can view analytics.
 */
export const getUrlAnalytics = wrapAsync(async (req, res) => {
  if (!req.user) throw new UnauthorizedError("Authentication required");

  const urlId = Number(req.params.urlId);

  // Verify URL exists and belongs to this user
  const url = await prisma.url.findUnique({ where: { id: urlId } });
  if (!url) throw new NotFoundError("URL not found");
  if (url.userId && url.userId !== req.user.id) {
    throw new UnauthorizedError("Not authorised to view this URL's analytics");
  }

  const [totalClicks, uniqueClicks, dailyBreakdown] = await Promise.all([
    getTotalClicks(urlId),
    getUniqueClicks(urlId),
    getDailyBreakdown(urlId),
  ]);

  res.status(200).json({
    urlId,
    shortCode: url.shortCode,
    originalUrl: url.originalUrl,
    createdAt: url.createdAt,
    totalClicks,
    uniqueClicks,
    dailyBreakdown,
  });
});
