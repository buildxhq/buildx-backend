/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `trades` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "trades_name_key" ON "trades"("name");
