/*
  Warnings:

  - You are about to drop the column `total_rate` on the `Ratings` table. All the data in the column will be lost.
  - Added the required column `rate` to the `Ratings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ratings" DROP COLUMN "total_rate",
ADD COLUMN     "rate" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Article_id_idx" ON "Article"("id");

-- CreateIndex
CREATE INDEX "Article_video_id_idx" ON "Article"("video_id");
