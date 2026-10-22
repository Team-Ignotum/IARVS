import { hash, compare } from "bcrypt-ts";

const SALT_ROUNDS = 12;

export async function hashPassword(password) {
  return hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password, storedHash) {
  return compare(password, storedHash);
}
