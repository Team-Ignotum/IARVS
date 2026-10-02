import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pg from "pg";

import { config } from "dotenv";
import { hashPassword } from "../src/lib/password.mjs";

// Load .env so NIC_SSH_PUB_KEY_B64 is available during seeding
config({ path: new URL("../.env", import.meta.url).pathname });

// Connection adapater
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const seedPassword = process.env.ADMIN_SEED_PASSWORD;

  if (!seedPassword) {
    throw new Error("ADMIN_SEED_PASSWORD must be set before seeding");
  }

  const passwordHash = await hashPassword(seedPassword);
  const User = await prisma.user.upsert({
    where: { id: 1 },
    update: {
      email: "admin@gmail.com",
      password: passwordHash,
      name: "superAdmin",
      role: "ADMIN",
    },
    create: {
      id: 1,
      email: "admin@gmail.com",
      password: passwordHash,
      name: "superAdmin",
      role: "ADMIN",
    },
  });
  console.log(" Seed data created successfully!");
  console.log({
    user: User.email,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
