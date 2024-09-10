import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client'
import { DatabaseService } from 'src/database/database.service';


@Injectable()
export class CustomerService {
  constructor(private readonly databaseService: DatabaseService) { }

  create(createCustomerDto: Prisma.CustomersCreateInput) {
    return this.databaseService.customers.create({ data: createCustomerDto })
  }

  findAll() {
    return this.databaseService.customers.findMany()
  }

  findOne(id: string) {
    return this.databaseService.customers.findUnique({ where: { CustomerID: id } })
  }

  update(id: string, updateCustomerDto: Prisma.CustomersUpdateInput) {
    return this.databaseService.customers.update({ where: { CustomerID: id }, data: updateCustomerDto })
  }

  remove(id: string) {
    return this.databaseService.customers.delete({ where: { CustomerID: id } })
  }
}
