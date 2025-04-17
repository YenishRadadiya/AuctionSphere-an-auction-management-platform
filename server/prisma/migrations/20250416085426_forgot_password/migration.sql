/*
  Warnings:

  - You are about to drop the column `action` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `resource` on the `Permission` table. All the data in the column will be lost.
  - Changed the type of `status` on the `Auction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `name` on the `Permission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `name` on the `Role` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('USER', 'ORGANIZATION_ADMIN', 'ORGANIZATION_MANAGER', 'ORGANIZATION_EMPLOYEE', 'SYSTEM_ADMIN', 'SYSTEM_EMPLOYEE');

-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('ALL', 'CRUD_AUCTION');

-- CreateEnum
CREATE TYPE "AuctionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Auction" DROP COLUMN "status",
ADD COLUMN     "status" "AuctionStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "action",
DROP COLUMN "resource",
DROP COLUMN "name",
ADD COLUMN     "name" "PermissionType" NOT NULL;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "permissions" "PermissionType"[],
DROP COLUMN "name",
ADD COLUMN     "name" "RoleType" NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "token_expiresIn" TIMESTAMP(3),
ALTER COLUMN "password" SET DATA TYPE VARCHAR;

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");
