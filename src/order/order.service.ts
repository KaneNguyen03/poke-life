import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client'
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class OrderService {
  constructor(private readonly databaseService: DatabaseService) { }
  
  create(createOrderDto: Prisma.OrdersCreateInput) {
    return this.databaseService.orders.create({ data: createOrderDto })

  }

  findAll() {
    return this.databaseService.orders.findMany()
  }

  findOne(id: string) {
    return this.databaseService.orders.findUnique({ where: { OrderID: id } })
  }

  update(id: string, updateOrderDto: Prisma.OrdersUpdateInput) {
    return this.databaseService.orders.update({ where: { OrderID: id }, data: updateOrderDto })

  }

  remove(id: string) {
    return this.databaseService.orders.delete({ where: { OrderID: id } })

  }
}
