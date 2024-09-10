import { Injectable } from '@nestjs/common';


import { Prisma } from '@prisma/client'
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TransactionService {
  constructor(private readonly databaseService: DatabaseService) { }

  create(createTransactionDto: Prisma.TransactionsCreateInput) {
    return this.databaseService.transactions.create({ data: createTransactionDto })

  }

  findAll() {
    return this.databaseService.transactions.findMany()

  }

  findOne(id: string) {
    return this.databaseService.transactions.findUnique({ where: { TransactionID: id } })

  }

  update(id: string, updateTransactionDto: Prisma.TransactionsUpdateInput) {
    return this.databaseService.transactions.update({ where: { TransactionID: id }, data: updateTransactionDto })

  }

  remove(id: string) {
    return this.databaseService.transactions.delete({ where: { TransactionID: id } })

  }
}
