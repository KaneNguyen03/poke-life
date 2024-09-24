import { Injectable, NotFoundException } from '@nestjs/common'

import { Prisma } from '@prisma/client'
import { DatabaseService } from 'src/database/database.service'

@Injectable()
export class OrderDetailService {
  constructor(private readonly databaseService: DatabaseService) { }
  async create(createOrderDetailDto: Prisma.OrderDetailsCreateInput) {
    return await this.databaseService.orderDetails.create({
      data: createOrderDetailDto,
    })
  }

  async findAll(pageIndex: number, pageSize: number, keyword?: string) {
    try {
      const skip = (pageIndex - 1) * pageSize
      const take = pageSize

      // Điều kiện tìm kiếm
      const where: Prisma.OrderDetailsWhereInput = {
        IsDeleted: false, // Lọc những đơn hàng không bị xóa
        ...(keyword && {
          OR: [
            { OrderID: { contains: keyword, mode: 'insensitive' } },
            { FoodID: { contains: keyword, mode: 'insensitive' } },
            // Thêm các trường khác nếu cần
          ],
        }),
      }
      const orderDetails = await this.databaseService.orderDetails.findMany({
        skip,
        take,
        where,
      })

      // Nếu không tìm thấy đơn hàng nào, ném ngoại lệ
      if (orderDetails.length === 0) {
        throw new NotFoundException('No order details found')
      }

      return orderDetails
    } catch (error) {
      console.log('Error when get all order details: ', error)
    }
  }

  async findOrderDetailsByOrderID(pageIndex: number, pageSize: number, id: string, keyword?: string) {
    try {
      const skip = (pageIndex - 1) * pageSize
      const take = pageSize

      // Điều kiện tìm kiếm
      const where: Prisma.OrderDetailsWhereInput = {
        IsDeleted: false, // Lọc những đơn hàng không bị xóa
        OrderID: id,
        ...(keyword && {
          OR: [
            { OrderID: { contains: keyword, mode: 'insensitive' } },
            { FoodID: { contains: keyword, mode: 'insensitive' } },
            // Thêm các trường khác nếu cần
          ],
        }),
      }

      const orderDetails = await this.databaseService.orderDetails.findMany({
        skip,
        take,
        where,
        include: {
          Food: true, // Include the related Food object
        },
      })

      // Nếu không tìm thấy đơn hàng nào, ném ngoại lệ
      if (orderDetails.length === 0) {
        throw new NotFoundException('No order details found')
      }

      return orderDetails
    } catch (error) {
      console.log('Error when getting all order details: ', error)
    }
  }


  async findOne(id: string) {
    return await this.databaseService.orderDetails.findUnique({
      where: { OrderDetailID: id },
    })
  }

  async update(
    id: string,
    updateOrderDetailDto: Prisma.OrderDetailsUpdateInput,
  ) {
    return await this.databaseService.orderDetails.update({
      where: { OrderDetailID: id },
      data: updateOrderDetailDto,
    })
  }

  async remove(id: string) {
    return await this.databaseService.orderDetails.delete({
      where: { OrderDetailID: id },
    })
  }
}
