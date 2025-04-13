-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "proposalChecklist" JSONB,
ADD COLUMN     "proposalGeneratedBy" TEXT,
ADD COLUMN     "proposalUrl" TEXT;
