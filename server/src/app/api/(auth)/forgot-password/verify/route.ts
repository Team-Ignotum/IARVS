import { NextResponse } from "next/server";
import { z } from "zod";

import { verifyOTP } from "@/lib/auth/otp";
import { createResetToken } from "@/lib/auth/reset_token";

const verifySchema = z.object({
  challenge: z.string().regex(/^[a-f0-9]{64}$/),
  code: z.string().regex(/^\d{6}$/),
});

export async function POST(request: Request) {
  try {
    // ==========================================
    // 1. VALIDATE REQUEST
    // ==========================================

    const body = await request.json();

    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid verification request",
        },
        { status: 400 },
      );
    }

    const { challenge, code } = parsed.data;

    // ==========================================
    // 2. VERIFY RESET OTP USING REDIS
    // ==========================================

    const userId = await verifyOTP("RESET", challenge, code);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or expired verification code",
        },
        { status: 401 },
      );
    }

    // ==========================================
    // 3. CREATE PASSWORD RESET TOKEN
    // ==========================================

    const resetToken = await createResetToken(userId);

    // ==========================================
    // 4. RETURN SUCCESS
    // ==========================================

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
      resetToken,
      expiresIn: 300,
    });
  } catch (error) {
    console.error("Forgot password OTP verification error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "OTP verification failed",
      },
      { status: 500 },
    );
  }
}
