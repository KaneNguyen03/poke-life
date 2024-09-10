import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client'
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ComboService {
  constructor(private readonly databaseService: DatabaseService) { }

  create(createComboDto: Prisma.CombosCreateInput) {
    return this.databaseService.combos.create({ data: createComboDto })

  }

  findAll() {
    return this.databaseService.combos.findMany()
  }

  findOne(id: string) {
    return this.databaseService.combos.findUnique({ where: { ComboID: id } })

  }

  update(id: string, updateComboDto: Prisma.CombosUpdateInput) {
    return this.databaseService.combos.update({ where: { ComboID: id }, data: updateComboDto })

  }

  remove(id: string) {
    return this.databaseService.combos.delete({ where: { ComboID: id } })

  }
}
