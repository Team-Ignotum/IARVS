import bcrypt from "bcrypt-ts";

const SALT_ROUNDS =12;

export async function hashPassword(password) {
    return bcrypt.hash(password,SALT_ROUNDS)
}

export async function verifyPassword(password,storedHash){
    return bcrypt.compare(password,storedHash)
}