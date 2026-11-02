import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { z } from "zod";

import { UserRepository } from "@/repositories/user_repository_impl";

import { createOTPChallenge } from "@/lib/auth/otp";

import { sendOTPEmail } from "@/lib/otp_email";

const schema = z.object({
  email: z.email().trim().toLowerCase(),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    const repository = new UserRepository();

    const user = await repository.getByEmail(parsed.data.email);

    // Decoy challenge for unknown/inactive accounts.
    // No real OTP is associated with this challenge.
    let challenge = randomBytes(32).toString("hex");

    if (user && user.isActive && user.status === "ACTIVE") {
      const result = await createOTPChallenge("RESET", user.userId);

      challenge = result.challenge;

      await sendOTPEmail(user.email, result.code, "RESET");
    }

    return NextResponse.json({
      success: true,
      message: "If the account is eligible, a verification code has been sent.",
      challenge,
      expiresIn: 300,
    });
  } catch (error) {
    console.error("Password recovery error:", error);

    return NextResponse.json(
      { error: "Recovery service unavailable" },
      { status: 503 },
    );
  }
}
