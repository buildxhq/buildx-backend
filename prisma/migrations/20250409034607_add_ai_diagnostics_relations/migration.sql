-- CreateTable
CREATE TABLE "AiDiagnostics" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "issues" JSONB,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiDiagnostics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AiDiagnostics" ADD CONSTRAINT "AiDiagnostics_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiDiagnostics" ADD CONSTRAINT "AiDiagnostics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
