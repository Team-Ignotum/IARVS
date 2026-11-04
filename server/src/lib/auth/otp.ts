import "server-only";

import { createHmac, randomBytes, randomInt } from "node:crypto";
import { getRedis } from "@/lib/redis";

export type OTPPurpose = "LOGIN" | "RESET";

// =====================================================
// CONFIGURATION
// =====================================================

const OTP_TTL = 300; // 5 minutes
const CHALLENGE_TTL = 600; // 10 minutes
const MAX_ATTEMPTS = 5;

function sha(value: string): string {
  const secret = process.env.OTP_SECRET;

  if (!secret) {
    throw new Error("OTP_SECRET is not configured");
  }

  return createHmac("sha256", secret).update(value).digest("hex");
}

// =====================================================
// REDIS KEYS
// =====================================================

const otpKey = (purpose: OTPPurpose, challenge: string) =>
  `iarvs:otp:${purpose}:${challenge}`;

const challengeKey = (token: string) => `iarvs:challenge:${sha(token)}`;

// =====================================================
// GENERATE OTP
// =====================================================

export function generateOTP(): string {
  return randomInt(0, 1000000).toString().padStart(6, "0");
}

// =====================================================
// GENERATE SECURE RANDOM TOKEN
// =====================================================

export function randomToken(): string {
  return randomBytes(32).toString("hex");
}

// =====================================================
// HASH OTP
// =====================================================

function hashOTP(purpose: OTPPurpose, userId: string, code: string): string {
  return sha(`${purpose}:${userId}:${code}`);
}

// =====================================================
// CREATE OTP CHALLENGE
// =====================================================

export async function createOTPChallenge(purpose: OTPPurpose, userId: string) {
  // Ensure Redis is connected before use.
  const redis = await getRedis();

  const challenge = randomToken();
  const code = generateOTP();

  const key = otpKey(purpose, challenge);

  const otpData = {
    userId,
    digest: hashOTP(purpose, userId, code),
    attempts: 0,
  };

  await redis
    .multi()
    .set(key, JSON.stringify(otpData), {
      EX: OTP_TTL,
    })
    .set(challengeKey(challenge), purpose, {
      EX: CHALLENGE_TTL,
    })
    .exec();

  return {
    challenge,
    code,
    expiresIn: OTP_TTL,
  };
}

// =====================================================
// ATOMIC OTP VERIFICATION SCRIPT
// =====================================================

const VERIFY_SCRIPT = `
local raw = redis.call("GET", KEYS[1])

if not raw then
  return "EXPIRED"
end

local data = cjson.decode(raw)

if data.attempts >= tonumber(ARGV[2]) then
  redis.call("DEL", KEYS[1], KEYS[2])
  return "LOCKED"
end

if data.digest == ARGV[1] then
  redis.call("DEL", KEYS[1], KEYS[2])
  return data.userId
end

data.attempts = data.attempts + 1

if data.attempts >= tonumber(ARGV[2]) then
  redis.call("DEL", KEYS[1], KEYS[2])
  return "LOCKED"
end

redis.call(
  "SET",
  KEYS[1],
  cjson.encode(data),
  "KEEPTTL"
)

return "INVALID"
`;

// =====================================================
// VERIFY OTP
// =====================================================

export async function verifyOTP(
  purpose: OTPPurpose,
  challenge: string,
  code: string,
): Promise<string | null> {
  // Validate challenge format.
  if (!/^[a-f0-9]{64}$/.test(challenge)) {
    return null;
  }

  // Validate OTP format.
  if (!/^[0-9]{6}$/.test(code)) {
    return null;
  }

  // Ensure Redis is connected.
  const redis = await getRedis();

  const key = otpKey(purpose, challenge);

  const raw = await redis.get(key);

  if (!raw) {
    return null;
  }

  const data = JSON.parse(raw) as {
    userId: string;
  };

  const digest = hashOTP(purpose, data.userId, code);

  const result = await redis.eval(VERIFY_SCRIPT, {
    keys: [key, challengeKey(challenge)],
    arguments: [digest, MAX_ATTEMPTS.toString()],
  });

  if (result === "INVALID" || result === "EXPIRED" || result === "LOCKED") {
    return null;
  }

  return typeof result === "string" ? result : null;
}
