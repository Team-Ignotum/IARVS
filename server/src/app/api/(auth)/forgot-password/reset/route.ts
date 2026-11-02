import { NextResponse } from "next/server";
import { hash } from "bcrypt-ts";
import { z } from "zod";

import prisma from "@/lib/prisma";

import { consumeResetToken } from "@/lib/auth/reset_token";

const schema = z.object({
  resetToken: z.string().regex(/^[a-f0-9]{64}$/),
  newPassword: z.string().min(12).max(128),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid token or password" },
        { status: 400 },
      );
    }

    const { resetToken, newPassword } = parsed.data;

    const userId = await consumeResetToken(resetToken);

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 401 },
      );
    }

    const passwordHash = await hash(newPassword, 12);

    await prisma.user.update({
      where: { userId },
      data: {
        passwordHash,
        sessionVersion: {
          increment: 1,
        },
      },
    });

    const response = NextResponse.json({
      success: true,
      message: "Password reset successful",
    });

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      { error: "Password reset failed" },
      { status: 500 },
    );
  }
}
