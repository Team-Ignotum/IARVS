import { createClient } from "redis";

const globalForRedis = globalThis as unknown as {
  redisClient?: ReturnType<typeof createClient>;
};

const redis =
  globalForRedis.redisClient ??
  createClient({
    url: process.env.REDIS_URL,
  });

redis.on("error", (error) => {
  console.error("Redis error:", error);
});

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redisClient = redis;
}

export async function getRedis() {
  if (!redis.isOpen) {
    await redis.connect();
  }

  return redis;
}
