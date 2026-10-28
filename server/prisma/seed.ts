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

// Regional centres are shared reference data: seeded once, referenced by all users.
// Codes come from the university's centre register.
const CENTERS = [
  { centerId: "WP10", centerName: "Colombo" },
  { centerId: "CP20", centerName: "Kandy" },
  { centerId: "SP30", centerName: "Matara" },
  { centerId: "NP40", centerName: "Jaffna" },
  { centerId: "NC50", centerName: "Anuradhapura" },
  { centerId: "EP60", centerName: "Batticaloa" },
  { centerId: "NW70", centerName: "Kurunegala" },
  { centerId: "UP80", centerName: "Badulla" },
  { centerId: "SG90", centerName: "Ratnapura" },
  { centerId: "SP31", centerName: "Ambalangoda" },
  { centerId: "UP81", centerName: "Bandarawela" },
  { centerId: "SP32", centerName: "Galle" },
  { centerId: "WP11", centerName: "Gampaha" },
  { centerId: "NC51", centerName: "Polonnaruwa" },
  { centerId: "SG91", centerName: "Kegalle" },
  { centerId: "EP61", centerName: "Ampara" },
  { centerId: "SP33", centerName: "Ambalantota" },
  { centerId: "CP21", centerName: "Hatton" },
  { centerId: "WP12", centerName: "Kalutara" },
  { centerId: "NW72", centerName: "Kuliyapitiya" },
  { centerId: "UP82", centerName: "Monaragala" },
  { centerId: "NW71", centerName: "Puttalam" },
  { centerId: "EP62", centerName: "Trincomalee" },
  { centerId: "NP41", centerName: "Vavuniya" },
  { centerId: "NP42", centerName: "Kilinochchi" },
  { centerId: "NP43", centerName: "Mullaitivu" },
  { centerId: "NP44", centerName: "Mannar" },
];

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

  // Reference data survives reseeding, so it is upserted rather than deleted.
  await prisma.center.createMany({
    data: CENTERS,
    skipDuplicates: true,
  });

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      userId: "IA01",
      firstName: "Chamidu",
      lastName: "Dilshan",
      email: "admin@iarvs.lk",
      passwordHash: adminHash,
      role: "ADMIN",
      center: { connect: { centerId: "WP10" } },
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
      center: { connect: { centerId: "WP10" } },
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
      center: { connect: { centerId: "WP10" } },
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
