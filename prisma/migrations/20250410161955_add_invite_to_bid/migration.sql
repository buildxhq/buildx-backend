/*
  Warnings:

  - You are about to drop the column `userId` on the `Invite` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_userId_fkey";

-- AlterTable
ALTER TABLE "Bid" ADD COLUMN     "inviteId" TEXT;

-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_inviteId_fkey" FOREIGN KEY ("inviteId") REFERENCES "Invite"("id") ON DELETE SET NULL ON UPDATE CASCADE;
