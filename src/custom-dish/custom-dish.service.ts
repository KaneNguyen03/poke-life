import { Injectable } from '@nestjs/common';
// import { CreateCustomDishDto } from './dto/create-custom-dish.dto';
// import { UpdateCustomDishDto } from './dto/update-custom-dish.dto';

import { Prisma } from '@prisma/client'
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CustomDishService {
  constructor(private readonly databaseService: DatabaseService) { }

  create(createCustomDishDto: Prisma.CustomDishesCreateInput) {
    return this.databaseService.customDishes.create({ data: createCustomDishDto })

  }

  findAll() {
    return this.databaseService.customDishes.findMany()

  }

  findOne(id: string) {
    return this.databaseService.customDishes.findUnique({ where: { CustomDishID: id } })

  }

  update(id: string, updateCustomDishDto: Prisma.CustomDishesUpdateInput) {
    return this.databaseService.customDishes.update({ where: { CustomDishID: id }, data: updateCustomDishDto })

  }

  remove(id: string) {
    return this.databaseService.customDishes.delete({ where: { CustomDishID: id } })

  }
}
