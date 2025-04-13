/*
  Warnings:

  - The `planTier` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `role` to the `invites` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('gc', 'sub', 'ae', 'supplier', 'admin');

-- CreateEnum
CREATE TYPE "PlanTier" AS ENUM ('gc_starter', 'gc_growth', 'gc_unlimited', 'sub_verified_pro', 'sub_elite_partner', 'ae_professional', 'ae_enterprise', 'supplier_free', 'supplier_pro');

-- AlterTable
ALTER TABLE "invites" ADD COLUMN     "role" "Role" NOT NULL,
ADD COLUMN     "used" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "planTier",
ADD COLUMN     "planTier" "PlanTier" NOT NULL DEFAULT 'gc_starter',
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'gc';
