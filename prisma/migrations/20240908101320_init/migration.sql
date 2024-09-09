-- CreateTable
CREATE TABLE "Users" (
    "UserID" SERIAL NOT NULL,
    "Username" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "PhoneNumber" TEXT NOT NULL,
    "Address" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("UserID")
);

-- CreateTable
CREATE TABLE "Customers" (
    "CustomerID" SERIAL NOT NULL,
    "FullName" TEXT NOT NULL,
    "DateOfBirth" TIMESTAMP(3),
    "Email" TEXT NOT NULL,
    "PhoneNumber" TEXT NOT NULL,
    "Address" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("CustomerID")
);

-- CreateTable
CREATE TABLE "Food" (
    "FoodID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT,
    "Price" DECIMAL(10,2) NOT NULL,
    "Calories" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("FoodID")
);

-- CreateTable
CREATE TABLE "Combos" (
    "ComboID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT,
    "Price" DECIMAL(10,2) NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Combos_pkey" PRIMARY KEY ("ComboID")
);

-- CreateTable
CREATE TABLE "ComboItems" (
    "ComboItemID" SERIAL NOT NULL,
    "ComboID" INTEGER NOT NULL,
    "FoodID" INTEGER NOT NULL,
    "Quantity" INTEGER NOT NULL,

    CONSTRAINT "ComboItems_pkey" PRIMARY KEY ("ComboItemID")
);

-- CreateTable
CREATE TABLE "Orders" (
    "OrderID" SERIAL NOT NULL,
    "CustomerID" INTEGER NOT NULL,
    "TotalPrice" DECIMAL(10,2) NOT NULL,
    "OrderStatus" TEXT NOT NULL DEFAULT 'Pending',
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("OrderID")
);

-- CreateTable
CREATE TABLE "OrderDetails" (
    "OrderDetailID" SERIAL NOT NULL,
    "OrderID" INTEGER NOT NULL,
    "FoodID" INTEGER NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "Price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "OrderDetails_pkey" PRIMARY KEY ("OrderDetailID")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "TransactionID" SERIAL NOT NULL,
    "OrderID" INTEGER NOT NULL,
    "PaymentMethod" TEXT NOT NULL,
    "Amount" DECIMAL(10,2) NOT NULL,
    "TransactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Status" TEXT NOT NULL DEFAULT 'Completed',

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("TransactionID")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "ReviewID" SERIAL NOT NULL,
    "CustomerID" INTEGER NOT NULL,
    "FoodID" INTEGER NOT NULL,
    "Rating" INTEGER NOT NULL,
    "Comment" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("ReviewID")
);

-- CreateTable
CREATE TABLE "_OrdersToUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_Username_key" ON "Users"("Username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_Email_key" ON "Users"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Customers_Email_key" ON "Customers"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "_OrdersToUsers_AB_unique" ON "_OrdersToUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_OrdersToUsers_B_index" ON "_OrdersToUsers"("B");

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
