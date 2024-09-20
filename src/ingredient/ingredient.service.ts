import { Injectable } from '@nestjs/common';
// import { CreateIngredientDto } from './dto/create-ingredient.dto';
// import { UpdateIngredientDto } from './dto/update-ingredient.dto';

import { Prisma } from '@prisma/client'
import { DatabaseService } from 'src/database/database.service';


@Injectable()
export class IngredientService {
  constructor(private readonly databaseService: DatabaseService) { }

  create(createIngredientDto: Prisma.IngredientsCreateInput) {
    return this.databaseService.ingredients.create({ data: createIngredientDto })
  }

  findAll() {
    return this.databaseService.ingredients.findMany()
  }

  findOne(id: string) {
    return this.databaseService.ingredients.findUnique({ where: { IngredientID: id } })
  }

  update(id: string, updateIngredientDto: Prisma.IngredientsUpdateInput) {
    return this.databaseService.ingredients.update({ where: { IngredientID: id }, data: updateIngredientDto })
  }

  remove(id: string) {
    return this.databaseService.ingredients.delete({ where: { IngredientID: id } })

  }
}
