/*
  Warnings:

  - You are about to drop the column `IngredientImage` on the `CustomDishIngredients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CustomDishIngredients" DROP COLUMN "IngredientImage";

-- AlterTable
ALTER TABLE "Ingredients" ADD COLUMN     "IngredientImage" TEXT;
