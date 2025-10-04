-- AlterTable
ALTER TABLE "public"."RefreshToken" ALTER COLUMN "token" SET DATA TYPE VARCHAR;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "password" SET DATA TYPE VARCHAR;
