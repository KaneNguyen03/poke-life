import { Injectable, NotFoundException } from '@nestjs/common'

import { Prisma } from '@prisma/client'
import { DatabaseService } from 'src/database/database.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'

interface MonthlyData {
  name: string
  users: number
  orders: number
  revenue?: number
}

interface DailyData {
  day: number
  users: number
  orders: number
  revenue?: number
}

@Injectable()
export class TransactionService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createTransactionDto: CreateTransactionDto) {
    try {
      // Lấy Order theo orderID
      const order = await this.databaseService.orders.findUnique({
        where: { OrderID: createTransactionDto.orderID },
      })

      if (!order) {
        throw new Error(
          `Order with ID ${createTransactionDto.orderID} not found.`,
        )
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
      }

      // Tạo giao dịch mới
      await this.databaseService.transactions.create({
        data: data,
      })

      return data
    } catch (error) {
      console.log('Error when create transaction: ', error)
    }
  }

  async getStatistics() {
    const [
      totalCustomers,
      pendingOrders,
      finishedOrders,
      totalRevenue,
      popularItem,
      usersByMonth,
      ordersByMonth,
      usersByDay,
      ordersByDay,
      revenueByDay // Add revenue by day
    ] = await Promise.all([
      this.databaseService.customers.count(),
      this.databaseService.orders.count({
        where: {
          OrderStatus: 'Pending',
        },
      }),
      this.databaseService.orders.count({
        where: {
          OrderStatus: 'Finished',
        },
      }),
      this.databaseService.orders.aggregate({
        where: {
          OrderStatus: 'Finished',
        },
        _sum: {
          TotalPrice: true,
        },
      }),
      this.databaseService.orderDetails.groupBy({
        by: ['FoodID'],
        _count: {
          FoodID: true,
        },
        orderBy: {
          _count: {
            FoodID: 'desc',
          },
        },
        take: 1,
      }),
      this.databaseService.customers.groupBy({
        by: ['CreatedAt'],
        _count: {
          CreatedAt: true,
        },
        orderBy: {
          CreatedAt: 'asc',
        },
      }),
      this.databaseService.orders.groupBy({
        by: ['CreatedAt'],
        _count: {
          CreatedAt: true,
        },
        orderBy: {
          CreatedAt: 'asc',
        },
      }),
      this.databaseService.customers.groupBy({
        by: ['CreatedAt'],
        _count: {
          CreatedAt: true,
        },
        where: {
          CreatedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
          },
        },
        orderBy: {
          CreatedAt: 'asc',
        },
      }),
      this.databaseService.orders.groupBy({
        by: ['CreatedAt'],
        _count: {
          CreatedAt: true,
        },
        where: {
          CreatedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
          },
        },
        orderBy: {
          CreatedAt: 'asc',
        },
      }),
      // New query for daily revenue
      this.databaseService.orders.groupBy({
        by: ['CreatedAt'],
        _sum: {
          TotalPrice: true,
        },
        where: {
          OrderStatus: 'Finished',
          CreatedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
          },
        },
        orderBy: {
          CreatedAt: 'asc',
        },
      }),
    ])

    const mostPopularFood = popularItem.length ? await this.databaseService.food.findUnique({
      where: {
        FoodID: popularItem[0].FoodID,
      },
    }) : null

    // Prepare viewLineChart data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const formatMonthlyData = (data: Array<any>, key: 'users' | 'orders'): Array<MonthlyData> => {
      const monthlyData: MonthlyData[] = Array(12).fill(0).map((_, i) => ({ name: months[i], users: 0, orders: 0 }))
      data.forEach(({ CreatedAt, _count }) => {
        const month = new Date(CreatedAt).getMonth()
        if (key === 'users') {
          monthlyData[month].users += _count.CreatedAt
        } else if (key === 'orders') {
          monthlyData[month].orders += _count.CreatedAt
        }
      })
      return monthlyData
    }

    const formatDailyData = (data: Array<any>, key: 'users' | 'orders' | 'revenue'): Array<DailyData> => {
      const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
      const dailyData: DailyData[] = Array(daysInMonth).fill(0).map((_, i) => ({ day: i + 1, users: 0, orders: 0, revenue: 0 }))

      data.forEach((item) => {
        const day = new Date(item.CreatedAt).getDate() // Ensure you're accessing CreatedAt correctly
        if (key === 'users') {
          dailyData[day - 1].users += item._count?.CreatedAt || 0 // Use _count for user data
        } else if (key === 'orders') {
          dailyData[day - 1].orders += item._count?.CreatedAt || 0 // Use _count for order data
        } else if (key === 'revenue') {
          dailyData[day - 1].revenue += item._sum?.TotalPrice || 0 // Use _sum for revenue data
        }
      })

      return dailyData
    }



    const userMonthlyData = formatMonthlyData(usersByMonth, 'users')
    const orderMonthlyData = formatMonthlyData(ordersByMonth, 'orders')

    // Combine users and orders into viewLineChart
    const viewLineChart = userMonthlyData.map((data, index) => ({
      name: data.name,
      users: data.users,
      orders: orderMonthlyData[index].orders,
      amt: data.users + orderMonthlyData[index].orders,
    }))

    // Prepare viewLineChartByMonth data for current month
    const userDailyData = formatDailyData(usersByDay, 'users')
    const orderDailyData = formatDailyData(ordersByDay, 'orders')
    const revenueDailyData = formatDailyData(revenueByDay, 'revenue') // Calculate revenue data

    const viewLineChartByMonth = userDailyData.map((data, index) => ({
      day: data.day,
      users: data.users,
      orders: orderDailyData[index].orders,
      revenue: revenueDailyData[index].revenue, // Add revenue attribute
    }))

    return {
      totalCustomers,
      pendingOrders,
      finishedOrders,
      totalRevenue: totalRevenue._sum.TotalPrice || 0,
      mostPopularFood,
      viewLineChart,
      viewLineChartByMonth,
    }
  }


  async findAll(pageIndex: number, pageSize: number, keyword?: string) {
    try {
      const skip = (pageIndex - 1) * pageSize
      const take = pageSize

      // Điều kiện tìm kiếm
      const where: Prisma.TransactionsWhereInput = {
        IsDeleted: false, // Lọc những đơn hàng không bị xóa
        ...(keyword && {
          OR: [
            { OrderID: { contains: keyword, mode: 'insensitive' } },
            // Thêm các trường khác nếu cần
          ],
        }),
      }
      // Gọi findMany để lấy danh sách giao dịch
      const transactions = await this.databaseService.transactions.findMany({
        skip,
        take,
        where,
      })

      // Kiểm tra nếu danh sách giao dịch rỗng
      if (transactions.length === 0) {
        // Ném ngoại lệ nếu không có giao dịch nào
        throw new NotFoundException('No transactions found')
      }

      // Trả về danh sách giao dịch nếu có dữ liệu
      return transactions
    } catch (error) {
      // Xử lý lỗi hoặc ném lỗi tiếp tục
      console.log('Error when get all transactions: ', error)
    }
  }

  async findOne(id: string) {
    try {
      // Gọi findMany để lấy danh sách giao dịch
      const transaction = await this.databaseService.transactions.findUnique({
        where: { TransactionID: id },
      })

      // Kiểm tra nếu danh sách giao dịch rỗng
      if (transaction == null) {
        // Ném ngoại lệ nếu không có giao dịch nào
        throw new NotFoundException(`Transactions ${id} not found`)
      }

      // Trả về danh sách giao dịch nếu có dữ liệu
      return transaction
    } catch (error) {
      // Xử lý lỗi hoặc ném lỗi tiếp tục
      console.log('Error when get a transaction: ', error)
    }
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    try {
      // Gọi findMany để lấy danh sách giao dịch
      const transaction = await this.databaseService.transactions.findUnique({
        where: { TransactionID: id },
      })

      // Kiểm tra nếu danh sách giao dịch rỗng
      if (transaction == null) {
        // Ném ngoại lệ nếu không có giao dịch nào
        throw new NotFoundException(`Transactions ${id} not found`)
      }

      // Lấy Order theo orderID
      const order = await this.databaseService.orders.findUnique({
        where: { OrderID: updateTransactionDto.orderID },
      })

      if (!order) {
        throw new Error(
          `Order with ID ${updateTransactionDto.orderID} not found.`,
        )
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
      }

      // Tạo giao dịch mới
      await this.databaseService.transactions.update({
        where: { TransactionID: id },
        data: data,
      })

      return data
    } catch (error) {
      // Xử lý lỗi hoặc ném lỗi tiếp tục
      console.log('Error when get a transaction: ', error)
    }
  }

  async remove(id: string) {
    return this.databaseService.transactions.delete({
      where: { TransactionID: id },
    })
  }
}
