import { DatabaseService } from 'src/database/database.service';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { CreateFoodDto, CreateCustomFoodDto } from './dto/create-food.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class FoodService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createFoodDto: CreateFoodDto) {
    // return await this.databaseService.food.create({ data: createFoodDto });
    try {
      const foodData: Prisma.FoodCreateInput = {
        Name: createFoodDto.name,
        Description: createFoodDto.description ?? 'No description',
        Price: createFoodDto.price,
        Calories: createFoodDto.calories,
        Image: createFoodDto.image ?? '',
      };

      const checkFood = await this.databaseService.food.create({
        data: foodData,
      });

      if (!checkFood) throw new Error('Fail to create food');
      else return 'Create food successfully';
    } catch (error) {
      console.log('Error when create a food: ', error);
    }
  }

  async createCustomDish(createCustomFoodDto: CreateCustomFoodDto) {
    try {
      const ingredientList = createCustomFoodDto.ingredientList;
      if (ingredientList == undefined || ingredientList.length == 0) {
        throw new Error('Not found ingredients to create food');
      }

      let totalCalories = 0;
      let totalPrice = new Decimal(0.0);

      for (const item of ingredientList) {
        const ingre = await this.databaseService.ingredients.findUnique({
          where: {
            IngredientID: item.ingredientID,
          },
        });
        if (!ingre)
          throw new Error(`Ingredient ID ${item.ingredientID} not found`);
        // Cộng số lượng calories
        totalCalories += ingre.Calories;
        // Cộng tổng giá - cần gán lại cho totalPrice
        totalPrice = totalPrice.plus(ingre.Price.times(item.quantity));
      }

      const foodData: Prisma.FoodCreateInput = {
        Name: createCustomFoodDto.name,
        Description: createCustomFoodDto.description ?? 'No description',
        Price: totalPrice,
        Calories: totalCalories,
        Image: createCustomFoodDto.image ?? '',
      };

      const checkFood = await this.databaseService.food.create({
        data: foodData,
      });

      if (!checkFood) throw new Error('Fail to create food');
      else {
        for (const item of ingredientList) {
          const customDishIngredientData: Prisma.CustomDishIngredientsCreateInput =
            {
              Food: {
                connect: { FoodID: checkFood.FoodID },
              },
              Ingredient: {
                connect: { IngredientID: item.ingredientID },
              },
              Quantity: item.quantity,
            };
          const checkCustomFood =
            await this.databaseService.customDishIngredients.create({
              data: customDishIngredientData,
            });
          if (!checkCustomFood)
            throw new Error('Error when create CustomDishIngredients data');
        }

        return 'Create custom dish successfully';
      }
    } catch (error) {
      console.log('Error when create a food: ', error);
    }
  }

  async findAll() {
    try {
      const foods = await this.databaseService.food.findMany({
        where: {
          IsDeleted: false,
        },
      });
      if (foods.length == 0) throw new NotFoundException('Not found any food');
      else return foods;
    } catch (error) {
      console.log('Error when get all food: ', error);
    }
  }

  async findOne(id: string) {
    return await this.databaseService.food.findUnique({
      where: { FoodID: id },
    });
  }

  async update(id: string, updateFoodDto: Prisma.FoodUpdateInput) {
    return await this.databaseService.food.update({
      where: { FoodID: id },
      data: updateFoodDto,
    });
  }

  async remove(id: string) {
    return await this.databaseService.food.delete({ where: { FoodID: id } });
  }
}
