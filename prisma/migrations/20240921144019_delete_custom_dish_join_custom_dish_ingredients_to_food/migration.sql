/*
  Warnings:

  - You are about to drop the column `CustomDishID` on the `CustomDishIngredients` table. All the data in the column will be lost.
  - You are about to drop the `CustomDishes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `FoodID` to the `CustomDishIngredients` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CustomDishIngredients" DROP CONSTRAINT "CustomDishIngredients_CustomDishID_fkey";

-- DropForeignKey
ALTER TABLE "CustomDishes" DROP CONSTRAINT "CustomDishes_CustomerID_fkey";

-- AlterTable
ALTER TABLE "CustomDishIngredients" DROP COLUMN "CustomDishID",
ADD COLUMN     "FoodID" TEXT NOT NULL;

-- DropTable
DROP TABLE "CustomDishes";

-- AddForeignKey
ALTER TABLE "CustomDishIngredients" ADD CONSTRAINT "CustomDishIngredients_FoodID_fkey" FOREIGN KEY ("FoodID") REFERENCES "Food"("FoodID") ON DELETE RESTRICT ON UPDATE CASCADE;
