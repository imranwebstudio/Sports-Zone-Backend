-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "sourceUrl" TEXT;

-- CreateIndex
CREATE INDEX "Article_sourceUrl_idx" ON "Article"("sourceUrl");
