
import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

// =====================================================
// CONFIGURATION
// =====================================================

const JWT_SECRET = process.env.JWT_SECRET;
const ISSUER = process.env.ISSUER;
const AUDIENCE = process.env.AUDIENCE;

if (!JWT_SECRET || !ISSUER || !AUDIENCE) {
  throw new Error(
    "JWT_SECRET, ISSUER and AUDIENCE must be configured"
  );
}

const secret = new TextEncoder().encode(JWT_SECRET);

const COOKIE_NAME = "token";
const SESSION_DURATION = 60 * 60; // 1 hour

// =====================================================
// TYPES
// =====================================================

interface SessionUser {
  userId: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  sessionVersion: number;
}

// =====================================================
// CREATE SESSION
// Call ONLY after successful OTP verification
// =====================================================

export async function createSession(
  user: SessionUser
): Promise<void> {
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
    .setIssuer(ISSUER!)
    .setAudience(AUDIENCE!)
    .setExpirationTime("1h")
    .sign(secret);

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });
}

// =====================================================
// GET SESSION
// Validate JWT + check current database user
// =====================================================

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
      issuer: ISSUER!,
      audience: AUDIENCE!,
    });

    if (
      typeof payload.sub !== "string" ||
      typeof payload.sessionVersion !== "number" ||
      typeof payload.id !== "string" ||
      payload.id !== payload.sub
    ) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        userId: payload.sub,
      },
    });

    if (
      !user ||
      !user.isActive ||
      user.status !== "ACTIVE"
    ) {
      return null;
    }

    // Reject sessions issued before a password reset.
    if (
      user.sessionVersion !== payload.sessionVersion
    ) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

// =====================================================
// REQUIRE AUTHENTICATION
// Use inside protected server routes
// =====================================================

export async function requireSession() {
  const user = await getSession();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}

// =====================================================
// ROLE-BASED AUTHORIZATION
// =====================================================

export async function requireRole(
  allowedRoles: SessionUser["role"][]
) {
  const user = await requireSession();

  if (!allowedRoles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }

  return user;
}

// =====================================================
// DESTROY SESSION / LOGOUT
// =====================================================

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_NAME);
}

// =====================================================
// ROLE-BASED REDIRECTS
// =====================================================

export function getRedirectUrl(role: string): string {
  const redirects: Record<string, string> = {
    STUDENT: "/student",
    STAFF: "/staff",
    ADMIN: "/admin",
    SUPER_STAFF: "/admin",
  };

  return redirects[role] ?? "/unauthorized";
}
