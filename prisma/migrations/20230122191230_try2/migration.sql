/*
  Warnings:

  - The `id` column on the `sessions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "sessions_id_key";

-- DropIndex
DROP INDEX "users_id_key";

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
