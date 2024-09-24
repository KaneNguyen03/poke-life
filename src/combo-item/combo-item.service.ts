import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ComboItemService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createComboItemDto: Prisma.ComboItemsCreateInput) {
    return await this.databaseService.comboItems.create({
      data: createComboItemDto,
    });
  }

  async findAll() {
    return await this.databaseService.comboItems.findMany();
  }

  async findOne(id: string) {
    return await this.databaseService.comboItems.findUnique({
      where: { ComboItemID: id },
    });
  }

  async update(id: string, updateComboItemDto: Prisma.ComboItemsUpdateInput) {
    return await this.databaseService.comboItems.update({
      where: { ComboItemID: id },
      data: updateComboItemDto,
    });
  }

  async remove(id: string) {
    return await this.databaseService.comboItems.delete({
      where: { ComboItemID: id },
    });
  }
}
