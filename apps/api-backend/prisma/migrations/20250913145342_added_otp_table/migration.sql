-- CreateEnum
CREATE TYPE "public"."Purpose" AS ENUM ('VERIFICATION', 'PASSWORD_RESET');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."OTP" (
    "id" SERIAL NOT NULL,
    "userUuid" UUID NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "purpose" "public"."Purpose" NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."OTP" ADD CONSTRAINT "OTP_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "public"."User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
