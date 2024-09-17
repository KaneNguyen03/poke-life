/*
  Warnings:

  - You are about to drop the `_OrdersToUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OrdersToUsers" DROP CONSTRAINT "_OrdersToUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrdersToUsers" DROP CONSTRAINT "_OrdersToUsers_B_fkey";

-- DropIndex
DROP INDEX "Users_Username_key";

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "PhoneNumber" DROP NOT NULL;

-- DropTable
DROP TABLE "_OrdersToUsers";
