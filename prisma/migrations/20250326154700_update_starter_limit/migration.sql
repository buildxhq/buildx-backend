-- AlterTable
ALTER TABLE "users" ADD COLUMN     "projectPostLimit" INTEGER NOT NULL DEFAULT 5,
ALTER COLUMN "aiTakeoffsLimit" SET DEFAULT 0;
