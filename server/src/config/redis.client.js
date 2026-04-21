import Redis from "ioredis";

// Singleton Redis client
let redis;

const createRedisClient = () => {
  const client = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    reconnectOnError: (err) => {
      console.error("[Redis] Reconnect error:", err.message);
      return true;
    },
  });

  client.on("connect", () => console.log("[Redis] Connected ✓"));
  client.on("error", (err) => console.error("[Redis] Error:", err.message));
  client.on("reconnecting", () => console.warn("[Redis] Reconnecting..."));

  return client;
};

// Export singleton
if (!redis) {
  redis = createRedisClient();
}

export default redis;
