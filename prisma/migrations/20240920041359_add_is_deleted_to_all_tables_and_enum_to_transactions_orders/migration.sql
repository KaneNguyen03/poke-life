/*
  Warnings:

  - You are about to drop the column `Status` on the `OrderDetails` table. All the data in the column will be lost.
  - The `OrderStatus` column on the `Orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `PaymentMethod` column on the `Transactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `Status` column on the `Transactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('Pending', 'Finished', 'Cancelled');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('COD', 'QRCODE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Pending', 'Cooking', 'Finished', 'Cancelled');

-- AlterTable
ALTER TABLE "ComboItems" ADD COLUMN     "IsDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Combos" ADD COLUMN     "IsDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "CustomDishIngredients" ADD COLUMN     "IsDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "CustomDishes" ADD COLUMN     "IsDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Customers" ADD COLUMN     "IsDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "IsDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Ingredients" ADD COLUMN     "IsDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "OrderDetails" DROP COLUMN "Status",
ADD COLUMN     "IsDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "OrderStatus",
ADD COLUMN     "OrderStatus" "OrderStatus" NOT NULL DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "Reviews" ADD COLUMN     "IsDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "PaymentMethod",
ADD COLUMN     "PaymentMethod" "PaymentMethod" NOT NULL DEFAULT 'COD',
DROP COLUMN "Status",
ADD COLUMN     "Status" "TransactionStatus" NOT NULL DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "IsDeleted" BOOLEAN NOT NULL DEFAULT false;
