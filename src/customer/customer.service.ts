import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CustomerService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createCustomerDto: Prisma.CustomersCreateInput) {
    return await this.databaseService.customers.create({
      data: createCustomerDto,
    });
  }

  async findAll() {
    return await this.databaseService.customers.findMany();
  }

  async findOne(id: string) {
    return await this.databaseService.customers.findUnique({
      where: { CustomerID: id },
    });
  }

  async update(id: string, updateCustomerDto: Prisma.CustomersUpdateInput) {
    return await this.databaseService.customers.update({
      where: { CustomerID: id },
      data: updateCustomerDto,
    });
  }

  async remove(id: string) {
    return await this.databaseService.customers.update({
      where: { CustomerID: id },
      data: {
        IsDeleted: true,
      },
    });
  }
}
