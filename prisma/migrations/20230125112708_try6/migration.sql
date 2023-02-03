/*
  Warnings:

  - You are about to drop the column `OnOFF` on the `sessions` table. All the data in the column will be lost.
  - The `is_registered` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "OnOFF";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_registered",
ADD COLUMN     "is_registered" INTEGER;
