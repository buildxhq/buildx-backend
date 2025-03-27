/*
  Warnings:

  - You are about to drop the column `createdAt` on the `invites` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `invites` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `invites` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `invites` table. All the data in the column will be lost.
  - You are about to drop the column `used` on the `invites` table. All the data in the column will be lost.
  - Added the required column `invited_by` to the `invites` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_id` to the `invites` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "invites_email_key";

-- DropIndex
DROP INDEX "invites_token_key";

-- AlterTable
ALTER TABLE "invites" DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
DROP COLUMN "role",
DROP COLUMN "token",
DROP COLUMN "used",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "inviteUserId" INTEGER,
ADD COLUMN     "invited_by" INTEGER NOT NULL,
ADD COLUMN     "project_id" INTEGER NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_inviteUserId_fkey" FOREIGN KEY ("inviteUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
