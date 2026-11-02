import { randomInt, createHmac, timingSafeEqual } from "node:crypto";

export type OtpPurpose = "login" | "reset";

export function generateOTP(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashOTP(
  userId: string,
  purpose: OtpPurpose,
  otp: string,
): string {
  const secret = process.env.OTP_SECRET;

  if (!secret) {
    throw new Error("OTP_SECRET is not configured");
  }

  return createHmac("sha256", secret)
    .update(`${purpose}:${userId}:${otp}`)
    .digest("hex");
}

export function compareOTP(storedHash: string, suppliedHash: string): boolean {
  const a = Buffer.from(storedHash, "hex");
  const b = Buffer.from(suppliedHash, "hex");

  return a.length === b.length && timingSafeEqual(a, b);
}
