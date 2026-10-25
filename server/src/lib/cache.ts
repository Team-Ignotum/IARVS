import { getRedis } from "@/lib/redis";

export async function getOrSetCache<T>(
  key: string,
  fetchData: () => Promise<T>,
  ttlSeconds = 300,
): Promise<T> {
  const redis = await getRedis();

  const cached = await redis.get(key);

  if (cached !== null) {
    return JSON.parse(cached) as T;
  }

  const data = await fetchData();

  await redis.set(key, JSON.stringify(data), {
    EX: ttlSeconds,
  });

  return data;
}
