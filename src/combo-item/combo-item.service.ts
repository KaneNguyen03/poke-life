import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client'
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ComboItemService {
  constructor(private readonly databaseService: DatabaseService) { }
  create(createComboItemDto: Prisma.ComboItemsCreateInput) {
    return this.databaseService.comboItems.create({ data: createComboItemDto })

  }

  findAll() {
    return this.databaseService.comboItems.findMany()

  }

  findOne(id: string) {
    return this.databaseService.comboItems.findUnique({ where: { ComboItemID: id } })

  }

  update(id: string, updateComboItemDto: Prisma.ComboItemsUpdateInput) {
    return this.databaseService.comboItems.update({ where: { ComboItemID: id }, data: updateComboItemDto })

  }

  remove(id: string) {
    return this.databaseService.comboItems.delete({ where: { ComboItemID: id } })

  }
}
