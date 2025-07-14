-- DropForeignKey
ALTER TABLE "Auction" DROP CONSTRAINT "Auction_approved_by_fkey";

-- AlterTable
ALTER TABLE "Auction" ALTER COLUMN "approved_by" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
