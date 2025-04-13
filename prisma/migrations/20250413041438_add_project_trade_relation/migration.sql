-- CreateTable
CREATE TABLE "_project_trades" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_project_trades_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_project_trades_B_index" ON "_project_trades"("B");

-- AddForeignKey
ALTER TABLE "_project_trades" ADD CONSTRAINT "_project_trades_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_project_trades" ADD CONSTRAINT "_project_trades_B_fkey" FOREIGN KEY ("B") REFERENCES "Trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
