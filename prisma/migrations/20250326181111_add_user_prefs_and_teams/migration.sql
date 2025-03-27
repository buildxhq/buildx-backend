/*
  Warnings:

  - You are about to drop the column `invited_at` on the `team_members` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `team_members` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `team_members` table. All the data in the column will be lost.
  - Added the required column `owner_id` to the `team_members` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "team_members" DROP CONSTRAINT "team_members_project_id_fkey";

-- AlterTable
ALTER TABLE "team_members" DROP COLUMN "invited_at",
DROP COLUMN "project_id",
DROP COLUMN "role",
ADD COLUMN     "owner_id" INTEGER NOT NULL,
ADD COLUMN     "projectsId" INTEGER,
ADD COLUMN     "usersId" INTEGER;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_projectsId_fkey" FOREIGN KEY ("projectsId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
