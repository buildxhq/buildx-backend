-- CreateTable
CREATE TABLE "AiSchedule" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "scheduleJson" JSONB NOT NULL,
    "milestoneSummary" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiSchedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AiSchedule" ADD CONSTRAINT "AiSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiSchedule" ADD CONSTRAINT "AiSchedule_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
