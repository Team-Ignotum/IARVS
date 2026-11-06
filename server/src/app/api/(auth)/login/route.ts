import { NextResponse } from "next/server";
import { compare } from "bcrypt-ts";
import { UserRepository } from "@/repositories/user_repository_impl";
import { createOTPChallenge } from "@/lib/auth/otp";
import { sendOTPEmail } from "@/lib/otp_email";
import { createSession, getRedirectUrl } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const email = formData.get("email");
    const password = formData.get("password");

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const userRepository = new UserRepository();

    const user = await userRepository.getByEmail(email.trim().toLowerCase());

    // Generic error prevents account enumeration.
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const isPasswordValid = await compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    if (!user.isActive || user.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Account is unavailable" },
        { status: 403 },
      );
    }
    //checking if user enabled 2 factor authentication 
    if (!user.isTwoFactorEnabled) {
      await createSession(user);

      return NextResponse.json({
        success: true,
        message: "Login successful",
        requiresOTP: false,
        redirectUrl: getRedirectUrl(user.role),
      });
    }


    const { challenge, code, expiresIn } = await createOTPChallenge(
      "LOGIN",
      user.userId,
    );

    await sendOTPEmail(user.email, code, "LOGIN");

    return NextResponse.json({
      success: true,
      message: "OTP sent to registered email",
      requiresOTP: true,
      challenge,
      expiresIn,
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }
}
