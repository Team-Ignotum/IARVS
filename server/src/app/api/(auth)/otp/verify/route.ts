import { NextResponse } from "next/server";
import { z } from "zod";

import { UserRepository } from "@/repositories/user_repository_impl";
import { verifyOTP } from "@/lib/auth/otp";
import { createSession, getRedirectUrl } from "@/lib/auth/session";

const schema = z.object({
  challenge: z.string().regex(/^[a-f0-9]{64}$/),
  code: z.string().regex(/^\d{6}$/),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid OTP request" },
        { status: 400 },
      );
    }

    const { challenge, code } = parsed.data;

    // 1. Verify the OTP using Redis.
    const userId = await verifyOTP("LOGIN", challenge, code);

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 401 },
      );
    }

    // 2. Retrieve the authenticated user.
    const userRepository = new UserRepository();

    const user = await userRepository.findByUserId(userId);

    if (!user || !user.isActive || user.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Account unavailable" },
        { status: 403 },
      );
    }

    // 3. Create JWT session only after OTP verification.
    await createSession(user);

    // 4. Determine dashboard based on database role.
    const redirectUrl = getRedirectUrl(user.role);

    // 5. Return the correct destination.
    return NextResponse.json({
      success: true,
      message: "Login successful",
      redirectUrl,
    });
  } catch (error) {
    console.error("OTP verification error:", error);

    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
