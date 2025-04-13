-- AlterTable
ALTER TABLE "users" ADD COLUMN     "certifications" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "laborAffiliations" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "regions" TEXT[] DEFAULT ARRAY[]::TEXT[];
