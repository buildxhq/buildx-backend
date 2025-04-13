-- CreateTable
CREATE TABLE "AiPostAward" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "summaryReport" TEXT NOT NULL,
    "nextSteps" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiPostAward_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AiPostAward" ADD CONSTRAINT "AiPostAward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiPostAward" ADD CONSTRAINT "AiPostAward_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
