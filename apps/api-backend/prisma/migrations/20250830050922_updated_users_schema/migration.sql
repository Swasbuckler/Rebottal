/*
  Warnings:

  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `isVerified` on the `Users` table. All the data in the column will be lost.
  - The `id` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[uuid]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `Users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "public"."Users" DROP CONSTRAINT "Users_pkey",
DROP COLUMN "isVerified",
ADD COLUMN     "uuid" UUID NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_uuid_key" ON "public"."Users"("uuid");
