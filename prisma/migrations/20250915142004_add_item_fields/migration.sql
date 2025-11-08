/*
  Warnings:

  - Added the required column `category` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Item" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'disponível',
ADD COLUMN     "trade" BOOLEAN NOT NULL DEFAULT false;
