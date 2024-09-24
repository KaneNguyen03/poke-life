/*
  Warnings:

  - Added the required column `TotalCalo` to the `Combos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Combos" ADD COLUMN     "ImageComboURL" TEXT,
ADD COLUMN     "TotalCalo" INTEGER NOT NULL;
