-- CreateTable
CREATE TABLE "AiEstimation" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "costEstimate" DOUBLE PRECISION NOT NULL,
    "tradeBreakdown" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiEstimation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AiEstimation" ADD CONSTRAINT "AiEstimation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiEstimation" ADD CONSTRAINT "AiEstimation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
