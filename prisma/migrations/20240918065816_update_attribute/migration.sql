-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "Image" TEXT;

-- AlterTable
ALTER TABLE "OrderDetails" ADD COLUMN     "Status" TEXT NOT NULL DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "Transactions" ALTER COLUMN "Status" SET DEFAULT 'Pending';
