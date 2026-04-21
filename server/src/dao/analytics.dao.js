import prisma from "../config/prisma.client.js";

/**
 * Get per-day click counts for a URL.
 * Groups analytics rows by calendar date.
 */
export const getDailyBreakdown = async (urlId) => {
  const rows = await prisma.$queryRaw`
    SELECT
      DATE(timestamp) AS date,
      COUNT(*) AS count
    FROM analytics
    WHERE url_id = ${Number(urlId)}
    GROUP BY DATE(timestamp)
    ORDER BY DATE(timestamp) ASC
  `;
  // Convert BigInt counts to plain numbers for JSON serialisation
  return rows.map((r) => ({ date: r.date, count: Number(r.count) }));
};

/**
 * Total number of clicks (all redirects)
 */
export const getTotalClicks = async (urlId) => {
  return await prisma.analytics.count({ where: { urlId: Number(urlId) } });
};

/**
 * Unique clicks — distinct IP addresses
 */
export const getUniqueClicks = async (urlId) => {
  const result = await prisma.$queryRaw`
    SELECT COUNT(DISTINCT ip_address) AS unique_count
    FROM analytics
    WHERE url_id = ${Number(urlId)}
  `;
  return Number(result[0]?.unique_count ?? 0);
};

/**
 * Full analytics row for a URL (latest 500 entries)
 */
export const getAnalyticsForUrl = async (urlId) => {
  return await prisma.analytics.findMany({
    where: { urlId: Number(urlId) },
    orderBy: { timestamp: "desc" },
    take: 500,
  });
};

/**
 * Record a single click event. Called from BullMQ worker.
 */
export const recordClick = async (urlId, ipAddress, userAgent) => {
  return await prisma.analytics.create({
    data: {
      urlId: Number(urlId),
      ipAddress: ipAddress || "unknown",
      userAgent: userAgent || "unknown",
    },
  });
};
