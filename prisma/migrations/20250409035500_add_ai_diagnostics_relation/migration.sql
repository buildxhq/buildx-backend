-- AlterTable
ALTER TABLE "AiDiagnostics" ADD COLUMN     "flaggedTrades" JSONB,
ADD COLUMN     "riskLevel" TEXT;
