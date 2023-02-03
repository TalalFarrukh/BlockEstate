/*
  Warnings:

  - You are about to drop the column `is_Registered` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_Registered",
ADD COLUMN     "is_registered" TEXT;
