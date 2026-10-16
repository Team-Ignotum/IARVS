import { cookies } from "next/headers";
import * as jose from "jose";

export default async function getSession() {
  const token = (await cookies()).get("token")?.value;

  if (
    !token ||
    !process.env.JWT_SECRET ||
    !process.env.ISSUER ||
    !process.env.AUDIENCE
  ) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jose.jwtVerify(token, secret, {
      issuer: process.env.ISSUER,
      audience: process.env.AUDIENCE,
      algorithms: ["HS256"],
    });

    if (
      typeof payload.id !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.role !== "string"
    ) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      fname: payload.fname,
      lname: payload.lname,
    };
  } catch {
    // Invalid, expired, or incorrectly signed token
    return null;
  }
}
