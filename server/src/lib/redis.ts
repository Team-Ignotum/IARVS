import "server-only";

import { createClient } from "redis";

// =====================================================
// REDIS CLIENT CONFIGURATION
// =====================================================

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

const globalForRedis = globalThis as unknown as {
  redisClient?: ReturnType<typeof createClient>;
  redisConnectionPromise?: Promise<ReturnType<typeof createClient>> | null;
};

// =====================================================
// CREATE / REUSE REDIS CLIENT
// =====================================================

export const redis =
  globalForRedis.redisClient ??
  createClient({
    url: REDIS_URL,

    socket: {
      connectTimeout: 10000,

      reconnectStrategy: (retries) => {
        if (retries >= 10) {
          console.error("Redis maximum reconnection attempts reached");

          return new Error("Redis connection failed");
        }

        // Exponential backoff, capped at 3 seconds
        return Math.min(100 * Math.pow(2, retries), 3000);
      },
    },
  });

// =====================================================
// REDIS EVENT LISTENERS
// =====================================================

// Avoid registering duplicate listeners during
// Next.js development hot reloads.
if (redis.listenerCount("error") === 0) {
  redis.on("error", (error) => {
    console.error("Redis error:", error);
  });

  redis.on("connect", () => {
    console.log("Redis connecting...");
  });

  redis.on("ready", () => {
    console.log("Redis connection ready");
  });

  redis.on("reconnecting", () => {
    console.warn("Redis reconnecting...");
  });

  redis.on("end", () => {
    console.log("Redis connection closed");
  });
}

// =====================================================
// DEVELOPMENT SINGLETON
// =====================================================

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redisClient = redis;
}

// =====================================================
// CONNECTION MANAGEMENT
// =====================================================

let connectionPromise: Promise<typeof redis> | null = null;

export async function getRedis() {
  if (redis.isReady) {
    return redis;
  }

  // Reuse the same connection attempt across
  // concurrent API requests.
  const existingPromise =
    globalForRedis.redisConnectionPromise ?? connectionPromise;

  if (existingPromise) {
    return existingPromise;
  }

  const promise = (async () => {
    if (!redis.isOpen) {
      await redis.connect();
    }

    // Wait until the connection is ready.
    if (!redis.isReady) {
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          cleanup();
          reject(new Error("Redis readiness timeout"));
        }, 10000);

        function onReady() {
          cleanup();
          resolve();
        }

        function onEnd() {
          cleanup();
          reject(new Error("Redis connection closed"));
        }

        function cleanup() {
          clearTimeout(timeout);
          redis.off("ready", onReady);
          redis.off("end", onEnd);
        }

        redis.on("ready", onReady);
        redis.on("end", onEnd);

        if (redis.isReady) {
          cleanup();
          resolve();
        }
      });
    }

    return redis;
  })();

  connectionPromise = promise;

  if (process.env.NODE_ENV !== "production") {
    globalForRedis.redisConnectionPromise = promise;
  }

  try {
    return await promise;
  } finally {
    if (connectionPromise === promise) {
      connectionPromise = null;
    }

    if (globalForRedis.redisConnectionPromise === promise) {
      globalForRedis.redisConnectionPromise = null;
    }
  }
}

// =====================================================
// REDIS HEALTH CHECK
// =====================================================

export async function checkRedisConnection(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const client = await getRedis();

    const response = await client.ping();

    return {
      success: response === "PONG",
      message:
        response === "PONG"
          ? "Redis connected successfully"
          : "Unexpected Redis response",
    };
  } catch {
    return {
      success: false,
      message: "Redis connection unavailable",
    };
  }
}

// =====================================================
// GRACEFUL DISCONNECTION
// =====================================================

export async function disconnectRedis() {
  if (redis.isOpen) {
    await redis.quit();
  }
}
