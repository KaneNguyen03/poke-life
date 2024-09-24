import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
  Query,
} from '@nestjs/common'
import { OrderService } from './order.service'

// import { Prisma } from '@prisma/client';
import { AtStrategy } from 'src/auth/strategies'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { GetCurrentUser } from 'src/common/decorators'
import { Order } from './entities/order.entity'

@ApiTags('order')
@ApiBearerAuth()
@UseGuards(AtStrategy)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @GetCurrentUser()
    user: { sub: string; email: string; iat: string; exp: string },
  ) {
    if (!user) throw new ForbiddenException('User ID not found')
    return this.orderService.create(createOrderDto, user.sub)
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all orders' })
  @ApiResponse({ status: 200, description: 'List of orders.', type: Order })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiQuery({ name: 'pageIndex', required: false, type: Number, description: 'Page index, default is 1' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Number of items per page, default is 10' })
  @ApiQuery({ name: 'keyword', required: false, type: String, description: 'Optional search keyword' })
  async findAll(
    @Query('pageIndex') pageIndex: number = 1, // Mặc định là trang 1
    @Query('pageSize') pageSize: number = 10, // Mặc định là 10 mục trên mỗi trang
    @Query('keyword') keyword: string = '', // Từ khóa tìm kiếm tùy chọn
  ) {
    const orders = await this.orderService.findAll(pageIndex, pageSize, keyword)
    return orders // Trả về mảng các đơn hàng
  }

  @Get('customerID')
  @ApiOperation({ summary: 'Retrieve all orders by customer ID' })
  @ApiResponse({ status: 200, description: 'List all orders of customer.' })
  @ApiResponse({ status: 404, description: 'Orders not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAllByCustomerID(
    @GetCurrentUser()
    user: {
      sub: string
      email: string
      iat: string
      exp: string
    },
    @Query('pageIndex') pageIndex: number = 1, // Mặc định là trang 1
    @Query('pageSize') pageSize: number = 10, // Mặc định là 10 mục trên mỗi trang
    @Query('keyword') keyword?: string, // Từ khóa tìm kiếm tùy chọn
  ) {
    if (!user) throw new ForbiddenException('User ID not found')
    return this.orderService.findAllByCustomerID(
      user.sub,
      pageIndex,
      pageSize,
      keyword,
    )
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a orders by ID' })
  @ApiResponse({ status: 200, description: 'The orders information.' })
  @ApiResponse({ status: 404, description: 'Orders not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a order' })
  @ApiResponse({
    status: 200,
    description: 'The order information has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a order' })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Order item not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async remove(@Param('id') id: string) {
    return this.orderService.remove(id)
  }

}
