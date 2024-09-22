import { DatabaseService } from 'src/database/database.service';
import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

@Injectable()
export class FoodService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createFoodDto: Prisma.FoodCreateInput) {
    return await this.databaseService.food.create({ data: createFoodDto });
  }

  async createCustomDish(createFoodDto: Prisma.FoodCreateInput) {
    return await this.databaseService.food.create({ data: createFoodDto });
  }

  async findAll() {
    return await this.databaseService.food.findMany();
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
