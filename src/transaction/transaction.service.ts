import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createTransactionDto: CreateTransactionDto) {
    try {
      // Lấy Order theo orderID
      const order = await this.databaseService.orders.findUnique({
        where: { OrderID: createTransactionDto.orderID },
      });

      if (!order) {
        throw new Error(
          `Order with ID ${createTransactionDto.orderID} not found.`,
        );
      }

      // Tạo data object theo kiểu Prisma.TransactionsCreateInput
      const data: Prisma.TransactionsCreateInput = {
        PaymentMethod: createTransactionDto.paymentMethod,
        Amount: createTransactionDto.amount,
        TransactionDate: new Date(), // Sử dụng ngày hiện tại nếu không có giá trị
        Status: createTransactionDto.transactionStatus,
        IsDeleted: false, // Mặc định chưa bị xóa
        Order: {
          connect: { OrderID: createTransactionDto.orderID }, // Kết nối order
        },
      };

      // Tạo giao dịch mới
      await this.databaseService.transactions.create({
        data: data,
      });

      return data;
    } catch (error) {
      console.log('Error when create transaction: ', error);
    }
  }

  async findAll() {
    try {
      // Gọi findMany để lấy danh sách giao dịch
      const transactions = await this.databaseService.transactions.findMany();

      // Kiểm tra nếu danh sách giao dịch rỗng
      if (transactions.length === 0) {
        // Ném ngoại lệ nếu không có giao dịch nào
        throw new NotFoundException('No transactions found');
      }

      // Trả về danh sách giao dịch nếu có dữ liệu
      return transactions;
    } catch (error) {
      // Xử lý lỗi hoặc ném lỗi tiếp tục
      console.log('Error when get all transactions: ', error);
    }
  }

  async findOne(id: string) {
    try {
      // Gọi findMany để lấy danh sách giao dịch
      const transaction = await this.databaseService.transactions.findUnique({
        where: { TransactionID: id },
      });

      // Kiểm tra nếu danh sách giao dịch rỗng
      if (transaction == null) {
        // Ném ngoại lệ nếu không có giao dịch nào
        throw new NotFoundException(`Transactions ${id} not found`);
      }

      // Trả về danh sách giao dịch nếu có dữ liệu
      return transaction;
    } catch (error) {
      // Xử lý lỗi hoặc ném lỗi tiếp tục
      console.log('Error when get a transaction: ', error);
    }
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    try {
      // Gọi findMany để lấy danh sách giao dịch
      const transaction = await this.databaseService.transactions.findUnique({
        where: { TransactionID: id },
      });

      // Kiểm tra nếu danh sách giao dịch rỗng
      if (transaction == null) {
        // Ném ngoại lệ nếu không có giao dịch nào
        throw new NotFoundException(`Transactions ${id} not found`);
      }

      // Lấy Order theo orderID
      const order = await this.databaseService.orders.findUnique({
        where: { OrderID: updateTransactionDto.orderID },
      });

      if (!order) {
        throw new Error(
          `Order with ID ${updateTransactionDto.orderID} not found.`,
        );
      }

      // Tạo data object theo kiểu Prisma.TransactionsUpdateInput
      const data: Prisma.TransactionsUpdateInput = {
        PaymentMethod: updateTransactionDto.paymentMethod,
        Amount: updateTransactionDto.amount,
        TransactionDate: new Date(), // Sử dụng ngày hiện tại nếu không có giá trị
        Status: updateTransactionDto.transactionStatus,
        IsDeleted: false, // Mặc định chưa bị xóa
        Order: {
          connect: { OrderID: updateTransactionDto.orderID }, // Kết nối order
        },
      };

      // Tạo giao dịch mới
      await this.databaseService.transactions.update({
        where: { TransactionID: id },
        data: data,
      });

      return data;
    } catch (error) {
      // Xử lý lỗi hoặc ném lỗi tiếp tục
      console.log('Error when get a transaction: ', error);
    }
  }

  remove(id: string) {
    return this.databaseService.transactions.delete({
      where: { TransactionID: id },
    });
  }
}
