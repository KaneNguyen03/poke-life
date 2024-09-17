-- CreateTable
CREATE TABLE "Ingredients" (
    "IngredientID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT,
    "Calories" INTEGER NOT NULL,
    "Price" DECIMAL(10,2) NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ingredients_pkey" PRIMARY KEY ("IngredientID")
);

-- CreateTable
CREATE TABLE "CustomDishes" (
    "CustomDishID" TEXT NOT NULL,
    "CustomerID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT,
    "TotalPrice" DECIMAL(10,2) NOT NULL,
    "TotalCalories" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomDishes_pkey" PRIMARY KEY ("CustomDishID")
);

-- CreateTable
CREATE TABLE "CustomDishIngredients" (
    "CustomDishIngredientID" TEXT NOT NULL,
    "CustomDishID" TEXT NOT NULL,
    "IngredientID" TEXT NOT NULL,
    "Quantity" INTEGER NOT NULL,

    CONSTRAINT "CustomDishIngredients_pkey" PRIMARY KEY ("CustomDishIngredientID")
);

-- AddForeignKey
ALTER TABLE "CustomDishes" ADD CONSTRAINT "CustomDishes_CustomerID_fkey" FOREIGN KEY ("CustomerID") REFERENCES "Customers"("CustomerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomDishIngredients" ADD CONSTRAINT "CustomDishIngredients_CustomDishID_fkey" FOREIGN KEY ("CustomDishID") REFERENCES "CustomDishes"("CustomDishID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomDishIngredients" ADD CONSTRAINT "CustomDishIngredients_IngredientID_fkey" FOREIGN KEY ("IngredientID") REFERENCES "Ingredients"("IngredientID") ON DELETE RESTRICT ON UPDATE CASCADE;
