import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ComboService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createComboDto: Prisma.CombosCreateInput) {
    return await this.databaseService.combos.create({ data: createComboDto });
  }

  async findAll() {
    return await this.databaseService.combos.findMany();
  }

  async findOne(id: string) {
    return await this.databaseService.combos.findUnique({
      where: { ComboID: id },
    });
  }

  async update(id: string, updateComboDto: Prisma.CombosUpdateInput) {
    return await this.databaseService.combos.update({
      where: { ComboID: id },
      data: updateComboDto,
    });
  }

  async remove(id: string) {
    return await this.databaseService.combos.delete({ where: { ComboID: id } });
  }
}
