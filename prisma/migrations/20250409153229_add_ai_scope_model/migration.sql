-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "scopeSummary" TEXT;

-- CreateTable
CREATE TABLE "AiScope" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "scopeSummary" TEXT,
    "tradesMatched" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiScope_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AiScope" ADD CONSTRAINT "AiScope_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiScope" ADD CONSTRAINT "AiScope_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
