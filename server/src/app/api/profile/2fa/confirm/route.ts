import { NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { verifyOTP } from "@/lib/auth/otp";
import { getRedis } from "@/lib/redis";

const schema = z.object({
  challenge: z.string().regex(/^[a-f0-9]{64}$/),
  code: z.string().regex(/^\d{6}$/),
});

type ChangeData = {
  userId: string;
  enabled: boolean;
};

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = schema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid verification request" },
        { status: 400 },
      );
    }

    const { challenge, code } = parsed.data;

    const redis = await getRedis();
    const key = `iarvs:2fa-change:${challenge}`;

    const stored = await redis.get(key);

    if (!stored) {
      return NextResponse.json(
        { error: "Verification request expired" },
        { status: 401 },
      );
    }

    const change = JSON.parse(stored) as ChangeData;

    if (
      change.userId !== session.userId ||
      typeof change.enabled !== "boolean"
    ) {
      return NextResponse.json(
        { error: "Invalid verification request" },
        { status: 403 },
      );
    }

    const verifiedUserId = await verifyOTP("2FA_CHANGE", challenge, code);

    if (verifiedUserId !== session.userId) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 401 },
      );
    }

    const updated = await prisma.user.updateMany({
      where: {
        userId: session.userId,
        isActive: true,
        status: "ACTIVE",
        isTwoFactorEnabled: !change.enabled,
      },
      data: {
        isTwoFactorEnabled: change.enabled,
      },
    });

    await redis.del(key);

    if (updated.count !== 1) {
      return NextResponse.json(
        { error: "Account or 2FA status changed. Please try again." },
        { status: 409 },
      );
    }

    return NextResponse.json({
      success: true,
      enabled: change.enabled,
      message: change.enabled
        ? "Two-factor authentication enabled"
        : "Two-factor authentication disabled",
    });
  } catch (error) {
    console.error("2FA confirmation error:", error);

    return NextResponse.json(
      { error: "Unable to update 2FA settings" },
      { status: 500 },
    );
  }
}
