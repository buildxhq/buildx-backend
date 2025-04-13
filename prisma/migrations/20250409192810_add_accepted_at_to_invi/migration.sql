/*
  Warnings:

  - You are about to drop the column `acceptedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invite" ADD COLUMN     "acceptedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "acceptedAt";
