-- AlterTable
ALTER TABLE "User" ADD COLUMN     "certifications" TEXT[],
ADD COLUMN     "laborAffiliations" TEXT[],
ADD COLUMN     "regions" TEXT[],
ADD COLUMN     "tokenExpires" TEXT,
ADD COLUMN     "verificationToken" TEXT;
