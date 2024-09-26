import { Injectable } from '@nestjs/common';
// import { CreateCustomDishIngredientDto } from './dto/create-custom-dish-ingredient.dto';
// import { UpdateCustomDishIngredientDto } from './dto/update-custom-dish-ingredient.dto';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CustomDishIngredientService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    createCustomDishIngredientDto: Prisma.CustomDishIngredientsCreateInput,
  ) {
    return await this.databaseService.customDishIngredients.create({
      data: createCustomDishIngredientDto,
    });
  }

  async findAll() {
    return await this.databaseService.customDishIngredients.findMany();
  }

  async findOne(id: string) {
    return await this.databaseService.customDishIngredients.findUnique({
      where: { CustomDishIngredientID: id },
    });
  }

  async update(
    id: string,
    updateCustomDishIngredientDto: Prisma.CustomDishIngredientsUpdateInput,
  ) {
    return await this.databaseService.customDishIngredients.update({
      where: { CustomDishIngredientID: id },
      data: updateCustomDishIngredientDto,
    });
  }

  async remove(id: string) {
    return await this.databaseService.customDishIngredients.update({
      where: { CustomDishIngredientID: id },
      data: {
        IsDeleted: true,
      },
    });
  }
}
