import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

const secret = new TextEncoder().encode(JWT_SECRET);

const COOKIE_NAME = "token";
const SESSION_DURATION = 60 * 60; // 1 hour

interface SessionUser {
  userId: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  sessionVersion: number;
}

/**
 * Create JWT session after successful OTP verification.
 */
export async function createSession(user: SessionUser): Promise<string> {
  const token = await new SignJWT({
    id: user.userId,
    email: user.email,
    role: user.role,
    fname: user.firstName,
    lname: user.lastName,
    sessionVersion: user.sessionVersion,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.userId)
    .setIssuedAt()
    .setIssuer(process.env.ISSUER!)
    .setAudience(process.env.AUDIENCE!)
    .setExpirationTime("1h")
    .sign(secret);

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });

  return token;
}

/**
 * Validate JWT and retrieve authenticated user.
 */
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
      issuer: process.env.ISSUER!,
      audience: process.env.AUDIENCE!,
    });

    if (
      typeof payload.sub !== "string" ||
      typeof payload.sessionVersion !== "number"
    ) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        userId: payload.sub,
      },
    });

    if (!user) {
      return null;
    }

    // Account validation
    if (!user.isActive || user.status !== "ACTIVE") {
      return null;
    }

    // Invalidate sessions after password reset
    if (user.sessionVersion !== payload.sessionVersion) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}

export function getRedirectUrl(role: string): string {
  switch (role) {
    case "STUDENT":
      return "/student";

    case "STAFF":
      return "/staff";
    
    case "ADMIN":
      return "/admin"

    case "SUPER_STAFF":
      return "/super-staff";

    default:
      return "/unauthorized";
  }
}

/**
 * Remove the authentication cookie.
 */
export async function destroySession() {
  (await cookies()).delete(COOKIE_NAME);
}
