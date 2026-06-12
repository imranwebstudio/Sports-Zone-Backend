-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "externalId" TEXT;

-- CreateIndex
CREATE INDEX "Match_externalId_idx" ON "Match"("externalId");
