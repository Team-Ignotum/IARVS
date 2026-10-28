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

// Seeded accounts are spread across the centres round-robin so the admin
// centre filters and per-centre reporting have varied data to work with.
const DEFAULT_CENTER_CODE = "WP10";

// Email format follows the existing <role>@iarvs.lk convention; extra accounts
// get a numeric suffix so each address stays unique.
const ADMINS = [
  { userId: "IA01", firstName: "Chamidu", lastName: "Dilshan", email: "admin@iarvs.lk" },
  { userId: "IA02", firstName: "Nadeesha", lastName: "Perera", email: "admin2@iarvs.lk" },
  { userId: "IA03", firstName: "Sanjeewa", lastName: "Bandara", email: "admin3@iarvs.lk" },
  { userId: "IA04", firstName: "Dilini", lastName: "Wickramasinghe", email: "admin4@iarvs.lk" },
];

const STAFF = [
  { userId: "IS01", firstName: "Thilina", lastName: "Chandima", email: "staff@iarvs.lk" },
  { userId: "IS02", firstName: "Aisha", lastName: "Rahman", email: "staff2@iarvs.lk" },
  { userId: "IS03", firstName: "Daniel", lastName: "Smith", email: "staff3@iarvs.lk" },
  { userId: "IS04", firstName: "Kasun", lastName: "Fernando", email: "staff4@iarvs.lk" },
  { userId: "IS05", firstName: "Hiruni", lastName: "Jayasinghe", email: "staff5@iarvs.lk" },
  { userId: "IS06", firstName: "Ruwan", lastName: "Silva", email: "staff6@iarvs.lk" },
  { userId: "IS07", firstName: "Tharindu", lastName: "Weerasinghe", email: "staff7@iarvs.lk" },
  { userId: "IS08", firstName: "Ishara", lastName: "Gunasekara", email: "staff8@iarvs.lk" },
  { userId: "IS09", firstName: "Malith", lastName: "Rajapaksha", email: "staff9@iarvs.lk" },
  { userId: "IS10", firstName: "Sanduni", lastName: "Herath", email: "staff10@iarvs.lk" },
];

const STUDENTS = [
  { userId: "IST01", firstName: "Ruchira", lastName: "Lakshan", email: "student@iarvs.lk", regNumber: "721425539", stNumber: "S92065539", intake: "23/24" },
  { userId: "IST02", firstName: "Chen", lastName: "Wei", email: "student2@iarvs.lk", regNumber: "721425540", stNumber: "S92065540", intake: "23/24" },
  { userId: "IST03", firstName: "Elena", lastName: "Rodriguez", email: "student3@iarvs.lk", regNumber: "721425541", stNumber: "S92065541", intake: "23/24" },
  { userId: "IST04", firstName: "Marcus", lastName: "Smith", email: "student4@iarvs.lk", regNumber: "721425542", stNumber: "S92065542", intake: "23/24" },
  { userId: "IST05", firstName: "David", lastName: "Thompson", email: "student5@iarvs.lk", regNumber: "721425543", stNumber: "S92065543", intake: "23/24" },
  { userId: "IST06", firstName: "Amaya", lastName: "Senanayake", email: "student6@iarvs.lk", regNumber: "721425544", stNumber: "S92065544", intake: "24/25" },
  { userId: "IST07", firstName: "Thilini", lastName: "Abeywardena", email: "student7@iarvs.lk", regNumber: "721425545", stNumber: "S92065545", intake: "24/25" },
  { userId: "IST08", firstName: "Kavindu", lastName: "Dissanayake", email: "student8@iarvs.lk", regNumber: "721425546", stNumber: "S92065546", intake: "24/25" },
  { userId: "IST09", firstName: "Nimal", lastName: "Jayawardena", email: "student9@iarvs.lk", regNumber: "721425547", stNumber: "S92065547", intake: "24/25" },
  { userId: "IST10", firstName: "Sithmi", lastName: "Karunaratne", email: "student10@iarvs.lk", regNumber: "721425548", stNumber: "S92065548", intake: "24/25" },
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

  const centers = await prisma.center.findMany({
    where: { isActive: true },
    select: { id: true, centerId: true },
    orderBy: { centerId: "asc" },
  });

  if (centers.length === 0) {
    throw new Error("No active centers found; seed the centers first");
  }

  // Colombo (the main campus) is first so the earliest accounts keep a sensible
  // default, then the rest are assigned in a stable round-robin order.
  const orderedCenters = [
    ...centers.filter((center) => center.centerId === DEFAULT_CENTER_CODE),
    ...centers.filter((center) => center.centerId !== DEFAULT_CENTER_CODE),
  ];

  const users = [
    ...ADMINS.map((user) => ({
      ...user,
      role: "ADMIN" as const,
      passwordHash: adminHash,
    })),
    ...STAFF.map((user) => ({
      ...user,
      role: "STAFF" as const,
      passwordHash: staffHash,
    })),
    ...STUDENTS.map((user) => ({
      ...user,
      role: "STUDENT" as const,
      passwordHash: studentHash,
    })),
  ];

  await prisma.user.createMany({
    data: users.map((user, index) => ({
      ...user,
      centerId: orderedCenters[index % orderedCenters.length].id,
      status: "ACTIVE" as const,
      isActive: true,
    })),
  });

  const counts = await prisma.user.groupBy({
    by: ["role"],
    _count: { _all: true },
  });

  console.log("Users seeded successfully:");
  console.table(
    counts.map((row) => ({ role: row.role, users: row._count._all })),
  );
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
