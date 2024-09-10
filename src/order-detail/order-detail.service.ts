import { Injectable } from '@nestjs/common';


import { Prisma } from '@prisma/client'
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class OrderDetailService {
  constructor(private readonly databaseService: DatabaseService) { }
  create(createOrderDetailDto: Prisma.OrderDetailsCreateInput) {
    return this.databaseService.orderDetails.create({ data: createOrderDetailDto })

  }

  findAll() {
    return this.databaseService.orderDetails.findMany()
  }

  findOne(id: string) {
    return this.databaseService.orderDetails.findUnique({ where: { OrderDetailID: id } })

  }

  update(id: string, updateOrderDetailDto: Prisma.OrderDetailsUpdateInput) {
    return this.databaseService.orderDetails.update({ where: { OrderDetailID: id }, data: updateOrderDetailDto })

  }

  remove(id: string) {
    return this.databaseService.orderDetails.delete({ where: { OrderDetailID: id } })

  }
}
