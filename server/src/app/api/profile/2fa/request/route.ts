import { NextResponse } from "next/server";
import { compare } from "bcrypt-ts";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { createOTPChallenge } from "@/lib/auth/otp";
import { sendOTPEmail } from "@/lib/otp_email";
import { getRedis } from "@/lib/redis";

const schema = z.object({
  currentPassword: z.string().min(1),
  enabled: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = schema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { currentPassword, enabled } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { userId: session.userId },
    });

    if (!user || !user.isActive || user.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Account unavailable" },
        { status: 403 },
      );
    }

    const validPassword = await compare(currentPassword, user.passwordHash);

    if (!validPassword) {
      return NextResponse.json(
        { error: "Incorrect current password" },
        { status: 401 },
      );
    }

    if (user.isTwoFactorEnabled === enabled) {
      return NextResponse.json(
        { error: "2FA already has the requested status" },
        { status: 409 },
      );
    }

    const { challenge, code, expiresIn } = await createOTPChallenge(
      "2FA_CHANGE",
      user.userId,
    );

    const redis = await getRedis();

    await redis.set(
      `iarvs:2fa-change:${challenge}`,
      JSON.stringify({
        userId: user.userId,
        enabled,
      }),
      { EX: expiresIn },
    );

    try {
      await sendOTPEmail(user.email, code, "2FA_CHANGE");
    } catch (error) {
      await redis.del(`iarvs:2fa-change:${challenge}`);
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent",
      challenge,
      expiresIn,
    });
  } catch (error) {
    console.error("2FA request error:", error);

    return NextResponse.json(
      { error: "Unable to request 2FA change" },
      { status: 500 },
    );
  }
}
