import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const saltLength = 16;
const keyLength = 64;

export async function hashPassword(password) {
  const salt = randomBytes(saltLength);
  const derivedKey = await scrypt(password, salt, keyLength);

  return `scrypt:${salt.toString("hex")}:${Buffer.from(derivedKey).toString("hex")}`;
}

export async function verifyPassword(password, storedHash) {
  const [algorithm, saltHex, hashHex] = storedHash.split(":");

  if (algorithm !== "scrypt" || !saltHex || !hashHex) {
    return false;
  }

  const salt = Buffer.from(saltHex, "hex");
  const expectedHash = Buffer.from(hashHex, "hex");
  const derivedKey = Buffer.from(await scrypt(password, salt, expectedHash.length));

  return expectedHash.length === derivedKey.length && timingSafeEqual(expectedHash, derivedKey);
}
