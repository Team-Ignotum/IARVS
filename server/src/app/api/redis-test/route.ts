import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export async function GET() {
  try {
    const redis = await getRedis();

    await redis.set("iarvs:redis-test", "connected", {
      EX: 60,
    });

    const value = await redis.get("iarvs:redis-test");

    return NextResponse.json({
      success: value === "connected",
      value,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Redis connection failed" },
      { status: 500 },
    );
  }
}
