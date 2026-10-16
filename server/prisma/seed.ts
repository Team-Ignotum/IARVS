import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/client";
import pg from "pg";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { hashPassword } from "../src/lib/password.mjs";

// Load .env
config({
  path: fileURLToPath(new URL("../.env", import.meta.url)),
});

// Database connection
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Validate passwords BEFORE deleting any data
  const adminPassword = process.env.ADMIN_SEED_PASSWORD;
  const staffPassword = process.env.STAFF_SEED_PASSWORD;
  const studentPassword = process.env.STUDENT_SEED_PASSWORD;

  if (!adminPassword || !staffPassword || !studentPassword) {
    throw new Error(
      "ADMIN_SEED_PASSWORD, STAFF_SEED_PASSWORD, and " +
        "STUDENT_SEED_PASSWORD must all be set in .env",
    );
  }

  // Hash passwords using bcrypt via password.mjs
  const [adminHash, staffHash, studentHash] = await Promise.all([
    hashPassword(adminPassword),
    hashPassword(staffPassword),
    hashPassword(studentPassword),
  ]);

  // WARNING: This deletes existing data from these tables.
  // Delete child records before their referenced parent records.
  await prisma.academicRecord.deleteMany();
  await prisma.curriculumModule.deleteMany();
  await prisma.studentEnrollment.deleteMany();
  await prisma.module.deleteMany();
  await prisma.curriculumVersion.deleteMany();
  await prisma.programme.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      userId: "IA01",
      firstName: "Chamidu",
      lastName: "Dilshan",
      email: "admin@iarvs.lk",
      passwordHash: adminHash,
      role: "ADMIN",
      center: "OUSL",
      status: "ACTIVE",
      isActive: true,
    },
  });

  // Create Staff
  const staff = await prisma.user.create({
    data: {
      userId: "IS01",
      firstName: "Thilina",
      lastName: "Chandima",
      email: "staff@iarvs.lk",
      passwordHash: staffHash,
      role: "STAFF",
      center: "OUSL",
      status: "ACTIVE",
      isActive: true,
    },
  });

  // Create Student
  const student = await prisma.user.create({
    data: {
      userId: "IST01",
      regNumber: "721425539",
      stNumber: "S92065539",
      firstName: "Ruchira",
      lastName: "Lakshan",
      email: "student@iarvs.lk",
      passwordHash: studentHash,
      role: "STUDENT",
      center: "OUSL",
      status: "ACTIVE",
      isActive: true,
    },
  });

  console.log("Users seeded successfully:");
  console.table([
    { role: admin.role, email: admin.email, userId: admin.userId },
    { role: staff.role, email: staff.email, userId: staff.userId },
    {
      role: student.role,
      email: student.email,
      userId: student.userId,
    },
  ]);
}

main()
  .catch((error) => {
    console.error("Error seeding data:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
