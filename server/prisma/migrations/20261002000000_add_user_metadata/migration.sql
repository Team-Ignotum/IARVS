-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'ADMIN', 'STAFF', 'SUPER_STAFF');

-- AddColumns
ALTER TABLE "User"
  ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
  ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Avoid silently selecting an arbitrary account when adding the unique email constraint.
DO $$
BEGIN
  IF EXISTS (
    SELECT "email"
    FROM "User"
    GROUP BY "email"
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Cannot add unique constraint: duplicate User.email values exist';
  END IF;
END $$;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Prisma manages updatedAt on writes after the existing rows are backfilled.
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;
