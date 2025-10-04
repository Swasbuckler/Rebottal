/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `purpose` on the `OTP` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('USER', 'ADMIN_LEVEL_1', 'ADMIN_LEVEL_2');

-- CreateEnum
CREATE TYPE "public"."OTPPurpose" AS ENUM ('VERIFICATION', 'PASSWORD_RESET');

-- AlterTable
ALTER TABLE "public"."OTP" DROP COLUMN "purpose",
ADD COLUMN     "purpose" "public"."OTPPurpose" NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "role",
ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "public"."Purpose";

-- DropEnum
DROP TYPE "public"."Role";
