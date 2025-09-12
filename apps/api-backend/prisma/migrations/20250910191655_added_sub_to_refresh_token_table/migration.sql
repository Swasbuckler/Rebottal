/*
  Warnings:

  - A unique constraint covering the columns `[sub]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sub` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."RefreshToken" ADD COLUMN     "sub" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_sub_key" ON "public"."RefreshToken"("sub");
