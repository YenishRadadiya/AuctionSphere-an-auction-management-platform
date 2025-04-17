/*
  Warnings:

  - Made the column `publish_time` on table `Auction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `Auction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Auction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Auction" ALTER COLUMN "publish_time" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;
