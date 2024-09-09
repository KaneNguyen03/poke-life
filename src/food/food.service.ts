import { DatabaseService } from 'src/database/database.service'
import { Injectable } from '@nestjs/common'

import { Prisma } from '@prisma/client'

@Injectable()
export class FoodService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createFoodDto: Prisma.FoodCreateInput) {
    return this.databaseService.food.create({ data: createFoodDto })
  }

  async findAll() {
    return this.databaseService.food.findMany()
  }

  async findOne(id: string) {
    return this.databaseService.food.findUnique({ where: { FoodID: id } })
  }

  async update(id: string, updateFoodDto: Prisma.FoodUpdateInput) {
    return this.databaseService.food.update({ where: { FoodID: id }, data: updateFoodDto })
  }

  async remove(id: string) {
    return this.databaseService.food.delete({ where: { FoodID: id } })
  }
}
