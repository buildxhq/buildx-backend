/*
  Warnings:

  - Added the required column `rebidMessage` to the `Bid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bid" ADD COLUMN     "rebidMessage" TEXT NOT NULL,
ADD COLUMN     "rebidRequestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
