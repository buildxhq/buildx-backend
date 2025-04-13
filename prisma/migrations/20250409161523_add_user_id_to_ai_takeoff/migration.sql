/*
  Warnings:

  - Added the required column `jobId` to the `AiTakeoff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `AiTakeoff` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AiTakeoff" ADD COLUMN     "jobId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AiTakeoff" ADD CONSTRAINT "AiTakeoff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiTakeoff" ADD CONSTRAINT "AiTakeoff_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
