-- Centers become a shared lookup table instead of a per-user record.
-- WARNING: this drops the existing free-text "users"."center" column.
-- Back up or map those values into "centers" before applying if they must be kept.

-- AlterTable
ALTER TABLE "users" DROP COLUMN "center",
ADD COLUMN     "centerId" INTEGER;

-- CreateTable
CREATE TABLE "centers" (
    "id" SERIAL NOT NULL,
    "centerId" TEXT NOT NULL,
    "centerName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "centers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "centers_centerId_key" ON "centers"("centerId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
