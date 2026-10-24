import { NextResponse } from "next/server";
import * as jose from "jose";
import { registrationSchema } from "./register.schema";
import { UserRepository } from "@/repositories/user_repository_impl";
import { Prisma } from "@/generated/client";
import { hash } from "bcrypt-ts";

export async function POST(request: Request) {
     const baseUrl = request.headers.get("origin");
  try {
    // 1. Read JSON request body
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body" },
        { status: 400 },
      );
    }

    // 2. Validate request using Zod
    const validation = registrationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid registration data",
          details: validation.error.issues,
        },
        { status: 400 },
      );
    }

    const input = validation.data;
    const email = input.email.trim().toLowerCase();

    // 3. Verify JWT configuration before creating the account
    const jwtSecret = process.env.JWT_SECRET;
    const issuer = process.env.ISSUER;
    const audience = process.env.AUDIENCE;
    const jwtExpiry = process.env.JWT_EXPIRY;

    if (!jwtSecret || !issuer || !audience || !jwtExpiry) {
      console.error("JWT environment variables are not configured");

      return NextResponse.json(
        { error: "Authentication service is not configured" },
        { status: 500 },
      );
    }

    // 4. Initialize repository
    const userRepository = new UserRepository();

    // 5. Check whether the email already exists
    const existingUser = await userRepository.getByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    // 6. Hash password
    const passwordHash = await hash(input.password, 12);

    // 7. Create user account
    const user = await userRepository.create({
      userId: input.userId,
      email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
      center: input.center,
      regNumber: input.regNumber,
      stNumber: input.stNumber,
      intake: input.intake,
    });

    // 8. Generate JWT
    const secret = new TextEncoder().encode(jwtSecret);

    const token = await new jose.SignJWT({
      id: user.userId,
      email: user.email,
      role: user.role,
      fname: user.firstName,
      lname: user.lastName,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer(issuer)
      .setAudience(audience)
      .setExpirationTime(jwtExpiry)
      .sign(secret);

    // Determine redirect URL based on role
    let redirectUrl = `${baseUrl}/unauthorized`;

    if (user.role === "STUDENT") {
      redirectUrl = `${baseUrl}/student`;
    } else if (user.role === "STAFF") {
      redirectUrl = `${baseUrl}/staff`;
    } 

    // 9. Set authentication cookie
    const response = NextResponse.json(
      {
        message: "Registration successful",
        redirectUrl: redirectUrl,
        user:{
            id:user.userId,
            email:user.email,
            role: user.role
        }
      },
      { status: 201 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    return response;
  } catch (error) {
    // Handle unique constraint violations
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Email or registration details already exist" },
        { status: 409 },
      );
    }

    console.error("Registration error:", error);

    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 },
    );
  }
}
