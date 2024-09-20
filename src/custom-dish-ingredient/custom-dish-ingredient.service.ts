import { Injectable } from '@nestjs/common';
// import { CreateCustomDishIngredientDto } from './dto/create-custom-dish-ingredient.dto';
// import { UpdateCustomDishIngredientDto } from './dto/update-custom-dish-ingredient.dto';
import { Prisma } from '@prisma/client'
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CustomDishIngredientService {
  constructor(private readonly databaseService: DatabaseService) { }

  create(createCustomDishIngredientDto: Prisma.CustomDishIngredientsCreateInput) {
    return this.databaseService.customDishIngredients.create({ data: createCustomDishIngredientDto })

  }

  findAll() {
    return this.databaseService.customDishIngredients.findMany()

  }

  findOne(id: string) {
    return this.databaseService.customDishIngredients.findUnique({ where: { CustomDishIngredientID: id } })

  }

  update(id: string, updateCustomDishIngredientDto: Prisma.CustomDishIngredientsUpdateInput) {
    return this.databaseService.customDishIngredients.update({ where: { CustomDishIngredientID: id }, data: updateCustomDishIngredientDto })

  }

  remove(id: string) {
    return this.databaseService.customDishIngredients.delete({ where: { CustomDishIngredientID: id } })

  }
}
