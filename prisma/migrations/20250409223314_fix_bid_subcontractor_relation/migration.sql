/*
  Warnings:

  - You are about to drop the column `userId` on the `Bid` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_userId_fkey";

-- AlterTable
ALTER TABLE "Bid" DROP COLUMN "userId",
ALTER COLUMN "rebidMessage" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_subcontractorId_fkey" FOREIGN KEY ("subcontractorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
