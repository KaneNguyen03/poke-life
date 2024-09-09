/*
  Warnings:

  - The primary key for the `ComboItems` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Combos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Customers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Food` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `OrderDetails` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Orders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Reviews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Transactions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "ComboItems" DROP CONSTRAINT "ComboItems_ComboID_fkey";

-- DropForeignKey
ALTER TABLE "ComboItems" DROP CONSTRAINT "ComboItems_FoodID_fkey";

-- DropForeignKey
ALTER TABLE "OrderDetails" DROP CONSTRAINT "OrderDetails_FoodID_fkey";

-- DropForeignKey
ALTER TABLE "OrderDetails" DROP CONSTRAINT "OrderDetails_OrderID_fkey";

-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_CustomerID_fkey";

-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_CustomerID_fkey";

-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_FoodID_fkey";

-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_OrderID_fkey";

-- DropForeignKey
ALTER TABLE "_OrdersToUsers" DROP CONSTRAINT "_OrdersToUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrdersToUsers" DROP CONSTRAINT "_OrdersToUsers_B_fkey";

-- AlterTable
ALTER TABLE "ComboItems" DROP CONSTRAINT "ComboItems_pkey",
ALTER COLUMN "ComboItemID" DROP DEFAULT,
ALTER COLUMN "ComboItemID" SET DATA TYPE TEXT,
ALTER COLUMN "ComboID" SET DATA TYPE TEXT,
ALTER COLUMN "FoodID" SET DATA TYPE TEXT,
ADD CONSTRAINT "ComboItems_pkey" PRIMARY KEY ("ComboItemID");
DROP SEQUENCE "ComboItems_ComboItemID_seq";

-- AlterTable
ALTER TABLE "Combos" DROP CONSTRAINT "Combos_pkey",
ALTER COLUMN "ComboID" DROP DEFAULT,
ALTER COLUMN "ComboID" SET DATA TYPE TEXT,
ALTER COLUMN "UpdatedAt" DROP DEFAULT,
ADD CONSTRAINT "Combos_pkey" PRIMARY KEY ("ComboID");
DROP SEQUENCE "Combos_ComboID_seq";

-- AlterTable
ALTER TABLE "Customers" DROP CONSTRAINT "Customers_pkey",
ALTER COLUMN "CustomerID" DROP DEFAULT,
ALTER COLUMN "CustomerID" SET DATA TYPE TEXT,
ALTER COLUMN "UpdatedAt" DROP DEFAULT,
ADD CONSTRAINT "Customers_pkey" PRIMARY KEY ("CustomerID");
DROP SEQUENCE "Customers_CustomerID_seq";

-- AlterTable
ALTER TABLE "Food" DROP CONSTRAINT "Food_pkey",
ALTER COLUMN "FoodID" DROP DEFAULT,
ALTER COLUMN "FoodID" SET DATA TYPE TEXT,
ALTER COLUMN "UpdatedAt" DROP DEFAULT,
ADD CONSTRAINT "Food_pkey" PRIMARY KEY ("FoodID");
DROP SEQUENCE "Food_FoodID_seq";

-- AlterTable
ALTER TABLE "OrderDetails" DROP CONSTRAINT "OrderDetails_pkey",
ALTER COLUMN "OrderDetailID" DROP DEFAULT,
ALTER COLUMN "OrderDetailID" SET DATA TYPE TEXT,
ALTER COLUMN "OrderID" SET DATA TYPE TEXT,
ALTER COLUMN "FoodID" SET DATA TYPE TEXT,
ADD CONSTRAINT "OrderDetails_pkey" PRIMARY KEY ("OrderDetailID");
DROP SEQUENCE "OrderDetails_OrderDetailID_seq";

-- AlterTable
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_pkey",
ALTER COLUMN "OrderID" DROP DEFAULT,
ALTER COLUMN "OrderID" SET DATA TYPE TEXT,
ALTER COLUMN "CustomerID" SET DATA TYPE TEXT,
ALTER COLUMN "UpdatedAt" DROP DEFAULT,
ADD CONSTRAINT "Orders_pkey" PRIMARY KEY ("OrderID");
DROP SEQUENCE "Orders_OrderID_seq";

-- AlterTable
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_pkey",
ALTER COLUMN "ReviewID" DROP DEFAULT,
ALTER COLUMN "ReviewID" SET DATA TYPE TEXT,
ALTER COLUMN "CustomerID" SET DATA TYPE TEXT,
ALTER COLUMN "FoodID" SET DATA TYPE TEXT,
ADD CONSTRAINT "Reviews_pkey" PRIMARY KEY ("ReviewID");
DROP SEQUENCE "Reviews_ReviewID_seq";

-- AlterTable
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_pkey",
ALTER COLUMN "TransactionID" DROP DEFAULT,
ALTER COLUMN "TransactionID" SET DATA TYPE TEXT,
ALTER COLUMN "OrderID" SET DATA TYPE TEXT,
ADD CONSTRAINT "Transactions_pkey" PRIMARY KEY ("TransactionID");
DROP SEQUENCE "Transactions_TransactionID_seq";

-- AlterTable
ALTER TABLE "Users" DROP CONSTRAINT "Users_pkey",
ALTER COLUMN "UserID" DROP DEFAULT,
ALTER COLUMN "UserID" SET DATA TYPE TEXT,
ALTER COLUMN "UpdatedAt" DROP DEFAULT,
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("UserID");
DROP SEQUENCE "Users_UserID_seq";

-- AlterTable
ALTER TABLE "_OrdersToUsers" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "ComboItems" ADD CONSTRAINT "ComboItems_ComboID_fkey" FOREIGN KEY ("ComboID") REFERENCES "Combos"("ComboID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComboItems" ADD CONSTRAINT "ComboItems_FoodID_fkey" FOREIGN KEY ("FoodID") REFERENCES "Food"("FoodID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_CustomerID_fkey" FOREIGN KEY ("CustomerID") REFERENCES "Customers"("CustomerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_OrderID_fkey" FOREIGN KEY ("OrderID") REFERENCES "Orders"("OrderID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_FoodID_fkey" FOREIGN KEY ("FoodID") REFERENCES "Food"("FoodID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_OrderID_fkey" FOREIGN KEY ("OrderID") REFERENCES "Orders"("OrderID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_CustomerID_fkey" FOREIGN KEY ("CustomerID") REFERENCES "Customers"("CustomerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_FoodID_fkey" FOREIGN KEY ("FoodID") REFERENCES "Food"("FoodID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrdersToUsers" ADD CONSTRAINT "_OrdersToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Orders"("OrderID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrdersToUsers" ADD CONSTRAINT "_OrdersToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("UserID") ON DELETE CASCADE ON UPDATE CASCADE;
