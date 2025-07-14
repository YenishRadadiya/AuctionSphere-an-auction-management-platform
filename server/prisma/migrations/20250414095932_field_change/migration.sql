/*
  Warnings:

  - You are about to drop the column `updated_at` on the `Auction` table. All the data in the column will be lost.
  - Made the column `created_at` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `NotificationType` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `NotificationType` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `Organization` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Organization` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `Permission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `RolePermission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `Users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Auction" DROP COLUMN "updated_at",
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Bid" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "NotificationType" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Permission" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "RolePermission" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET NOT NULL;
