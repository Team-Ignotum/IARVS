import "server-only";
import { createHmac, randomBytes, randomInt } from "node:crypto";
import  {redis}  from "@/lib/redis";

export type OTPPurpose = "LOGIN" | "RESET";

const OTP_TTL = 300;
const CHALLENGE_TTL = 600;

const sha = (value: string) =>
  createHmac("sha256", process.env.OTP_SECRET!).update(value).digest("hex");

const otpKey = (purpose: OTPPurpose, id: string) =>
  `iarvs:otp:${purpose}:${id}`;

const challengeKey = (token: string) => `iarvs:challenge:${sha(token)}`;

export function generateOTP(): string {
  return randomInt(0, 1000000).toString().padStart(6, "0");
}

export function randomToken(): string {
  return randomBytes(32).toString("hex");
}

function hashOTP(purpose: OTPPurpose, userId: string, code: string) {
  return sha(`${purpose}:${userId}:${code}`);
}

export async function createOTPChallenge(purpose: OTPPurpose, userId: string) {
  const challenge = randomToken();
  const code = generateOTP();
  const key = otpKey(purpose, challenge);

  await redis.set(
    key,
    JSON.stringify({
      userId,
      digest: hashOTP(purpose, userId, code),
      attempts: 0,
    }),
    { EX: OTP_TTL },
  );

  await redis.set(challengeKey(challenge), purpose, { EX: CHALLENGE_TTL });

  return { challenge, code, expiresIn: OTP_TTL };
}

const VERIFY_SCRIPT = `
local raw = redis.call("GET", KEYS[1])
if not raw then return "EXPIRED" end

local data = cjson.decode(raw)

if data.attempts >= 5 then
  redis.call("DEL", KEYS[1])
  return "LOCKED"
end

if data.digest == ARGV[1] then
  redis.call("DEL", KEYS[1])
  redis.call("DEL", KEYS[2])
  return data.userId
end

data.attempts = data.attempts + 1

if data.attempts >= 5 then
  redis.call("DEL", KEYS[1])
  redis.call("DEL", KEYS[2])
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

export async function verifyOTP(
  purpose: OTPPurpose,
  challenge: string,
  code: string,
): Promise<string | null> {
  if (!/^[a-f0-9]{64}$/.test(challenge)) {
    return null;
  }

  const key = otpKey(purpose, challenge);
  const raw = await redis.get(key);

  if (!raw) return null;

  const data = JSON.parse(raw) as {
    userId: string;
  };

  const digest = hashOTP(purpose, data.userId, code);

  const result = await redis.eval(VERIFY_SCRIPT, {
    keys: [key, challengeKey(challenge)],
    arguments: [digest],
  });

  if (result === "INVALID" || result === "EXPIRED" || result === "LOCKED") {
    return null;
  }

  return result as string;
}
