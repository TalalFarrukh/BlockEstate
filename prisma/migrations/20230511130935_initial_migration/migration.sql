-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "address" TEXT,
    "session_id" TEXT,
    "token" TEXT,
    "status" TEXT,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "address" TEXT,
    "cnic" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT,
    "contact" TEXT,
    "is_registered" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "land_sale" (
    "id" SERIAL NOT NULL,
    "land_id" INTEGER,
    "address" TEXT,
    "usercnic" TEXT,
    "price" INTEGER,
    "land_address" TEXT,
    "type" TEXT,
    "area" INTEGER,

    CONSTRAINT "land_sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bid_requests" (
    "id" SERIAL NOT NULL,
    "land_id" INTEGER,
    "seller_address" TEXT,
    "buyer_address" TEXT,
    "ask_price" INTEGER,
    "bid_price" INTEGER,
    "is_status" TEXT NOT NULL DEFAULT '0',
    "is_buyer_signed" TEXT NOT NULL DEFAULT '0',
    "is_seller_signed" TEXT NOT NULL DEFAULT '0',
    "is_buyer_paid" TEXT NOT NULL DEFAULT '0',
    "accepted_price" INTEGER,
    "seller_payment_id" TEXT,
    "buyer_payment_id" TEXT,

    CONSTRAINT "bid_requests_pkey" PRIMARY KEY ("id")
);
