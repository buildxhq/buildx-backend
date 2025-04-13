-- AlterTable
ALTER TABLE "Bid" ADD COLUMN     "proposalGeneratedBy" TEXT,
ADD COLUMN     "proposalUploadedAt" TIMESTAMP(3),
ADD COLUMN     "proposalUrl" TEXT;
