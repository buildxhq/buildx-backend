-- AlterTable
ALTER TABLE "Bid" ADD COLUMN     "contractSigned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "contractSignedAt" TIMESTAMP(3);
