/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "CAStatus" AS ENUM ('PASS', 'FAIL');

-- CreateEnum
CREATE TYPE "PassStatus" AS ENUM ('PASS', 'FAIL', 'ELIGIBLE');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "regNumber" TEXT,
    "stNumber" TEXT,
    "intake" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "center" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programmes" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programmes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curriculum_versions" (
    "id" SERIAL NOT NULL,
    "programmeId" INTEGER NOT NULL,
    "versionCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "intake" TEXT,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveTo" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "curriculum_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_enrollments" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "programmeId" INTEGER NOT NULL,
    "curriculumVersionId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modules" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "credits" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curriculum_modules" (
    "id" SERIAL NOT NULL,
    "curriculumVersionId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "isCompulsory" BOOLEAN NOT NULL DEFAULT true,
    "level" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "curriculum_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_records" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "curriculumVersionId" INTEGER NOT NULL,
    "attemptNumber" INTEGER NOT NULL,
    "grade" TEXT,
    "caStatus" "CAStatus" NOT NULL,
    "passStatus" "PassStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_userId_key" ON "users"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_regNumber_key" ON "users"("regNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_stNumber_key" ON "users"("stNumber");

-- CreateIndex
CREATE UNIQUE INDEX "programmes_code_key" ON "programmes"("code");

-- CreateIndex
CREATE INDEX "curriculum_versions_programmeId_idx" ON "curriculum_versions"("programmeId");

-- CreateIndex
CREATE UNIQUE INDEX "curriculum_versions_programmeId_versionCode_key" ON "curriculum_versions"("programmeId", "versionCode");

-- CreateIndex
CREATE INDEX "student_enrollments_studentId_idx" ON "student_enrollments"("studentId");

-- CreateIndex
CREATE INDEX "student_enrollments_programmeId_idx" ON "student_enrollments"("programmeId");

-- CreateIndex
CREATE INDEX "student_enrollments_curriculumVersionId_idx" ON "student_enrollments"("curriculumVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "modules_code_key" ON "modules"("code");

-- CreateIndex
CREATE INDEX "curriculum_modules_moduleId_idx" ON "curriculum_modules"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "curriculum_modules_curriculumVersionId_moduleId_key" ON "curriculum_modules"("curriculumVersionId", "moduleId");

-- CreateIndex
CREATE INDEX "academic_records_studentId_idx" ON "academic_records"("studentId");

-- CreateIndex
CREATE INDEX "academic_records_moduleId_idx" ON "academic_records"("moduleId");

-- CreateIndex
CREATE INDEX "academic_records_curriculumVersionId_idx" ON "academic_records"("curriculumVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "academic_records_studentId_moduleId_attemptNumber_key" ON "academic_records"("studentId", "moduleId", "attemptNumber");

-- AddForeignKey
ALTER TABLE "curriculum_versions" ADD CONSTRAINT "curriculum_versions_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "programmes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("stNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "programmes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_curriculumVersionId_fkey" FOREIGN KEY ("curriculumVersionId") REFERENCES "curriculum_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_modules" ADD CONSTRAINT "curriculum_modules_curriculumVersionId_fkey" FOREIGN KEY ("curriculumVersionId") REFERENCES "curriculum_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_modules" ADD CONSTRAINT "curriculum_modules_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_records" ADD CONSTRAINT "academic_records_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("stNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_records" ADD CONSTRAINT "academic_records_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_records" ADD CONSTRAINT "academic_records_curriculumVersionId_fkey" FOREIGN KEY ("curriculumVersionId") REFERENCES "curriculum_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
