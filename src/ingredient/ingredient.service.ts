import { Injectable } from '@nestjs/common';
// import { CreateIngredientDto } from './dto/create-ingredient.dto';
// import { UpdateIngredientDto } from './dto/update-ingredient.dto';

import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class IngredientService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createIngredientDto: Prisma.IngredientsCreateInput) {
    return await this.databaseService.ingredients.create({
      data: createIngredientDto,
    });
  }

  async findAll() {
    return await this.databaseService.ingredients.findMany();
  }

  async findOne(id: string) {
    return await this.databaseService.ingredients.findUnique({
      where: { IngredientID: id },
    });
  }

  async update(id: string, updateIngredientDto: Prisma.IngredientsUpdateInput) {
    return await this.databaseService.ingredients.update({
      where: { IngredientID: id },
      data: updateIngredientDto,
    });
  }

  async remove(id: string) {
    return await this.databaseService.ingredients.delete({
      where: { IngredientID: id },
    });
  }
}
