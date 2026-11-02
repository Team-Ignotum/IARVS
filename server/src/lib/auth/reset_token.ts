import "server-only";

import { createHash, randomBytes } from "node:crypto";

import { getRedis } from "@/lib/redis";

function resetKey(token: string): string {
  const digest = createHash("sha256").update(token).digest("hex");

  return `iarvs:reset-grant:${digest}`;
}

export async function createResetToken(userId: string): Promise<string> {
  const redis = await getRedis();

  const token = randomBytes(32).toString("hex");

  await redis.set(resetKey(token), userId, { EX: 300 });

  return token;
}

export async function consumeResetToken(token: string): Promise<string | null> {
  if (!/^[a-f0-9]{64}$/.test(token)) {
    return null;
  }

  const redis = await getRedis();

  const value = await redis.sendCommand(["GETDEL", resetKey(token)]);

  return typeof value === "string" ? value : null;
}
