import { Queue } from "bullmq";

// BullMQ connection config (uses same Redis instance)
const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
};

// Create the analytics queue
export const analyticsQueue = new Queue("analytics", {
  connection,
  defaultJobOptions: {
    attempts: 3,                      // Retry up to 3 times on failure
    backoff: { type: "exponential", delay: 1000 },
    removeOnComplete: { count: 100 }, // Keep last 100 completed jobs
    removeOnFail: { count: 50 },      // Keep last 50 failed jobs for debugging
  },
});

/**
 * Push a click event onto the queue.
 * Called from the redirect controller — fire and forget, non-blocking.
 */
export const addClickJob = async (urlId, ipAddress, userAgent) => {
  try {
    await analyticsQueue.add("click", { urlId, ipAddress, userAgent });
  } catch (err) {
    // Queue failure should NOT crash the redirect
    console.error("[Queue] Failed to add click job:", err.message);
  }
};
