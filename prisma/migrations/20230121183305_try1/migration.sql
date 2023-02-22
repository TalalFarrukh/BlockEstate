-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "address" TEXT,
    "session_id" TEXT,
    "token" TEXT,
    "status" TEXT,
    "OnOFF" TEXT
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "address" TEXT,
    "cnic" INTEGER,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT,
    "contact" INTEGER,
    "is_Registered" TEXT
);

-- CreateTable
CREATE TABLE "land_sale" (
    "id" SERIAL NOT NULL,
    "land_id" INTEGER,
    "address" TEXT,
    "usercnic" TEXT,
    "status" TEXT,
);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_id_key" ON "sessions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "land_sale"("id");
