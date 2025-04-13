-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "notes" TEXT;

-- CreateTable
CREATE TABLE "RebidRequest" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RebidRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RebidRequest" ADD CONSTRAINT "RebidRequest_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
