import { NextResponse } from "next/server";
import { compare } from "bcrypt-ts";
import * as jose from "jose";
import { UserRepository } from "@/repositories/user_repository_impl";


export async function POST(request: Request) {
  const baseUrl = request.headers.get("origin");

  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  if (!password) {
    return NextResponse.json(
      { error: "Password is required" },
      { status: 400 },
    );
  }

  try {
    const userRepository = new UserRepository();
    const user = await userRepository.getByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.passwordHash) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const isPasswordValid = await compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json(
        {
          error:
            "Your account has been deactivated. Please contact an administrator.",
        },
        { status: 403 },
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const algo = "HS256";

    const token = await new jose.SignJWT({
      id: user.userId,
      email: user.email,
      role: user.role.toString(),
      fname: user.firstName,
      lname: user.lastName,
    })
      .setProtectedHeader({ alg: algo })
      .setIssuedAt()
      .setIssuer(process.env.ISSUER!)
      .setAudience(process.env.AUDIENCE!)
      .setExpirationTime(process.env.JWT_EXPIRY!)
      .sign(secret);

    let redirectUrl = `${baseUrl}/unauthorized`;
    
    if (user.role === "STUDENT") {
      redirectUrl = `${baseUrl}/student`;
    } else if (user.role === "STAFF") {
      redirectUrl = `${baseUrl}/staff`;
    } else if (user.role === "ADMIN") {
      redirectUrl = `${baseUrl}/admin`;
    }
    const respone = NextResponse.json({
      message: "Login Successful",
      redirectUrl: redirectUrl,
    });

    // Set the JWT token in a secure HTTP cookie
    respone.headers.set(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly, sameSite:'lax'`,
    );
    return respone;
  } catch (error) {
    console.error("Error during authentication", error);
    return NextResponse.json(
      { error: "An error occurred during authentication" },
      { status: 500 },
    );
  }
}
