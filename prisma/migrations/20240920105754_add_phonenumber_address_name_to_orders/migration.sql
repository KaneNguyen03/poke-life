/*
  Warnings:

  - Added the required column `Address` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CustomerName` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PhoneNumber` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "Address" TEXT NOT NULL,
ADD COLUMN     "CustomerName" TEXT NOT NULL,
ADD COLUMN     "PhoneNumber" TEXT NOT NULL;
