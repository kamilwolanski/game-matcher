-- DropIndex
DROP INDEX "Tag_name_key";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "added" INTEGER,
ADD COLUMN     "platforms" TEXT[],
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "released" TIMESTAMP(3);
