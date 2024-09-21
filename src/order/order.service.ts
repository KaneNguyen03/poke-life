import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Prisma, TransactionStatus } from '@prisma/client'
import { DatabaseService } from 'src/database/database.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { OrderStatus } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

@Injectable()
export class OrderService {
  constructor(private readonly databaseService: DatabaseService) { }

  //DONE
  async create(createOrderDto: CreateOrderDto, currentUserId: string) {
    try {
      // Ensure order details are provided
      if (!createOrderDto.orderDetails || createOrderDto.orderDetails.length === 0) {
        throw new BadRequestException('Missing order details')
      }

      const orderDetailList = createOrderDto.orderDetails

      // Calculate total price from order details
      const totalPrice = await this.calculateTotalPrice(orderDetailList)

      // Create order data
      const orderData: Prisma.OrdersCreateInput = {
        Address: createOrderDto.address,
        PhoneNumber: createOrderDto.phoneNumber,
        CustomerName: createOrderDto.customerName,
        TotalPrice: totalPrice,
        IsDeleted: false,
        Customer: {
          connect: { CustomerID: currentUserId }, // Connect order to customer
        },
      }

      // Create order
      const checkOrder = await this.databaseService.orders.create({
        data: orderData,
      })

      if (checkOrder) {
        // Create order details
        for (const detail of orderDetailList) {
          const food = await this.databaseService.food.findUnique({ where: { FoodID: detail.foodID } })
          if (!food) {
            throw new Error('Food not found')
          }

          const orderDetailData: Prisma.OrderDetailsCreateInput = {
            Quantity: detail.quantity,
            Price: new Decimal(food.Price), // Ensure Price is a Decimal
            Order: {
              connect: { OrderID: checkOrder.OrderID }, // Connect order detail with the created order
            },
            Food: {
              connect: { FoodID: detail.foodID }, // Connect order detail with the corresponding food
            },
            IsDeleted: false, // Default not deleted
          }

          // Create order detail in the database
          const createdOrderDetail = await this.databaseService.orderDetails.create({
            data: orderDetailData,
          })

          // Check if order detail was created successfully
          if (!createdOrderDetail) {
            throw new Error('Fail to create order detail when creating order')
          }
        }

        // Create transaction data
        const transactionData: Prisma.TransactionsCreateInput = {
          PaymentMethod: createOrderDto.paymentMethod,
          Amount: new Decimal(totalPrice), // Ensure Amount is a Decimal
          TransactionDate: new Date(), // Use current date if not provided
          IsDeleted: false, // Default not deleted
          Order: {
            connect: { OrderID: checkOrder.OrderID }, // Connect order
          },
        }

        // Create transaction
        const checkTransaction = await this.databaseService.transactions.create({
          data: transactionData,
        })

        if (!checkTransaction) {
          throw new Error('Fail to create transaction when creating order')
        } else {
          return 'Create order successfully' // Consider adding status code
        }
      } else {
        throw new Error('Fail to create order')
      }
    } catch (error) {
      console.log('Error when creating order: ', error)
      throw error
    }
  }

  // Helper function to calculate total price
  private async calculateTotalPrice(orderDetails): Promise<Decimal> {
    const prices = await Promise.all(orderDetails.map(async (detail) => {
      const food = await this.databaseService.food.findUnique({ where: { FoodID: detail.foodID } })
      if (!food) {
        throw new Error('Food not found')
      }
      return new Decimal(detail.quantity).times(new Decimal(food.Price)) // Use Decimal operations
    }))

    return prices.reduce((acc, price) => acc.plus(price), new Decimal(0)) // Use Decimal operations
  }

  //DONE
  async findAll() {
    try {
      const orders = await this.databaseService.orders.findMany({
        where: { IsDeleted: false },
      })

      if (orders.length === 0) {
        throw new NotFoundException('No orders found')
      }
      return orders
    } catch (error) {
      console.log('Error when get all orders: ', error)
    }
  }

  //DONE
  async findOne(id: string) {
    try {
      const order = await this.databaseService.orders.findUnique({
        where: { OrderID: id, IsDeleted: false },
      })

      if (order == null) {
        throw new NotFoundException(`Order ${id} not found`)
      }

      return order
    } catch (error) {
      console.log('Error when get a order: ', error)
    }
  }

  //DONE
  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const orderToUpdate = await this.databaseService.orders.findUnique({
        where: { OrderID: id },
      })

      if (!orderToUpdate) {
        throw new NotFoundException(`Not found order ID ${id}`)
      }

      // Kiểm tra nếu status là finish hoặc cancelled
      if (
        orderToUpdate.OrderStatus === OrderStatus.Finished ||
        orderToUpdate.OrderStatus === OrderStatus.Cancelled
      ) {
        throw new BadRequestException('Cannot edit closed order')
      }

      const orderDataToUpdate: Prisma.OrdersUpdateInput = {
        OrderStatus: updateOrderDto.orderStatus,
        PhoneNumber: updateOrderDto.phoneNumber ?? orderToUpdate.PhoneNumber,
        CustomerName: updateOrderDto.customerName ?? orderToUpdate.CustomerName,
        Address: updateOrderDto.address ?? orderToUpdate.Address,
      }

      const checkUpdateOrder = await this.databaseService.orders.update({
        where: { OrderID: id },
        data: orderDataToUpdate,
      })

      let transactionStatus
      if (updateOrderDto.orderStatus === OrderStatus.Finished)
        transactionStatus = TransactionStatus.Finished
      else if (updateOrderDto.orderStatus === OrderStatus.Cancelled)
        transactionStatus = TransactionStatus.Cancelled

      if (checkUpdateOrder) {
        // Lấy transaction tương ứng với order
        const transactionToUpdate =
          await this.databaseService.transactions.findFirst({
            where: {
              OrderID: id,
            },
          })
        // Nếu tìm thấy transaction
        if (transactionToUpdate) {
          // Chuẩn bị dữ liệu để cập nhật Transaction
          const transactionDataToUpdate: Prisma.TransactionsUpdateInput = {
            PaymentMethod:
              updateOrderDto.paymentMethod ?? transactionToUpdate.PaymentMethod, // Cập nhật nếu có paymentMethod
            Status: transactionStatus ?? TransactionStatus.Pending, // Cập nhật nếu có transactionStatus
            IsDeleted: false, // Giữ nguyên IsDeleted
          }

          // Cập nhật Transaction trong database
          const checkUpdateTransaction =
            await this.databaseService.transactions.update({
              where: { TransactionID: transactionToUpdate.TransactionID },
              data: transactionDataToUpdate,
            })

          // Kiểm tra xem Transaction có cập nhật thành công không
          if (!checkUpdateTransaction) {
            throw new Error('Fail to update transaction')
          }
          return 'Update order successfully'
        } else {
          throw new NotFoundException('Transaction not found for this order')
        }
      } else {
        throw new Error('Fail to update order')
      }
    } catch (error) {
      console.log('Error when update order: ', error)
    }
  }

  //DONE
  async remove(id: string) {
    try {
      const orderToRemove = this.databaseService.orders.findUnique({
        where: { OrderID: id },
      })

      if (!orderToRemove)
        throw new NotFoundException(`Not found order ID ${id}`)

      const orderListToRemove =
        await this.databaseService.orderDetails.findMany({
          where: {
            OrderID: id,
          },
        })

      if (orderListToRemove.length != 0) {
        for (const detail of orderListToRemove) {
          const check = this.databaseService.orderDetails.update({
            where: {
              OrderDetailID: detail.OrderDetailID,
            },
            data: {
              IsDeleted: true,
            },
          })
          if (!check) throw new Error('Fail to remove order details')
        }
      }

      const transactionToRemove =
        await this.databaseService.transactions.findFirst({
          where: {
            OrderID: id,
          },
        })

      if (transactionToRemove) {
        const check = await this.databaseService.transactions.update({
          where: {
            TransactionID: transactionToRemove.TransactionID,
          },
          data: {
            IsDeleted: true,
          },
        })
        if (!check) throw new Error('Fail to remove transaction')
      }

      const check = await this.databaseService.orders.update({
        where: {
          OrderID: id,
        },
        data: {
          IsDeleted: true,
        },
      })
      if (check) {
        return `Order ID ${id} is removed`
      } else {
        throw new Error(`Fail to remove order ${id}`)
      }
    } catch (error) {
      console.log('Error when remove order: ', error)
    }
  }
}
