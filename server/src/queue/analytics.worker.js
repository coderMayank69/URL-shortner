import { Worker } from "bullmq";
import { recordClick } from "../dao/analytics.dao.js";

const getWorkerConnection = () => {
  if (process.env.REDIS_URL) {
    return { url: process.env.REDIS_URL };
  }

  return {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
  };
};

/**
 * Analytics worker — processes click events from the queue in the background.
 * This keeps the redirect route fast (< 5ms) by offloading DB writes here.
 */
export const startAnalyticsWorker = () => {
  const worker = new Worker(
    "analytics",
    async (job) => {
      const { urlId, ipAddress, userAgent } = job.data;
      await recordClick(urlId, ipAddress, userAgent);
    },
    {
      connection: getWorkerConnection(),
      concurrency: 5, // Process up to 5 jobs simultaneously
    }
  );

  worker.on("completed", (job) => {
    console.log(`[Worker] Job ${job.id} completed — click recorded for URL ${job.data.urlId}`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed:`, err.message);
  });

  worker.on("error", (err) => {
    console.error("[Worker] Worker error:", err.message);
  });

  console.log("[Worker] Analytics worker started ✓");
  return worker;
};
