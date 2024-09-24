import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common'
import { OrderDetailService } from './order-detail.service'

import { Prisma } from '@prisma/client'
import { AtStrategy } from 'src/auth/strategies'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('order-detail')
@ApiBearerAuth()
@UseGuards(AtStrategy)
@Controller('order-detail')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new order detail' })
  @ApiResponse({
    status: 201,
    description: 'The order detail has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async create(@Body() createOrderDetailDto: Prisma.OrderDetailsCreateInput) {
    return this.orderDetailService.create(createOrderDetailDto)
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all order details' })
  @ApiResponse({ status: 200, description: 'List of order details.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAll(
    @Query('pageIndex') pageIndex: number = 1, // Mặc định là trang 1
    @Query('pageSize') pageSize: number = 10, // Mặc định là 10 mục trên mỗi trang
    @Query('keyword') keyword?: string, // Từ khóa tìm kiếm tùy chọn
  ) {
    return this.orderDetailService.findAll(pageIndex, pageSize, keyword)
  }

  @Get('/order/:id')
  @ApiOperation({ summary: 'Retrieve order details by orderID' })
  @ApiResponse({ status: 200, description: 'List of order details.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiQuery({ name: 'pageIndex', required: false, type: Number, description: 'Page index, default is 1' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Number of items per page, default is 10' })
  @ApiQuery({ name: 'keyword', required: false, type: String, description: 'Optional search keyword' })
  async findOrderDetailsByOrderID(
    @Param('id') id: string,
    @Query('pageIndex') pageIndex?: string, // Optional parameter as string
    @Query('pageSize') pageSize?: string, // Optional parameter as string
    @Query('keyword') keyword?: string, // Optional parameter
  ) {
    const parsedPageIndex = parseInt(pageIndex || '', 10)
    const parsedPageSize = parseInt(pageSize || '', 10)

    // Set default values if parsing results in NaN
    const finalPageIndex = isNaN(parsedPageIndex) ? 1 : parsedPageIndex
    const finalPageSize = isNaN(parsedPageSize) ? 10 : parsedPageSize
    const finalKeyword = keyword ?? ''
    return this.orderDetailService.findOrderDetailsByOrderID(finalPageIndex, finalPageSize, id, finalKeyword)
  }


  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a order detail by ID' })
  @ApiResponse({ status: 200, description: 'The order detail information.' })
  @ApiResponse({ status: 404, description: 'Order detail not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findOne(@Param('id') id: string) {
    return this.orderDetailService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a order detail information' })
  @ApiResponse({
    status: 200,
    description: 'The order detail information has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Order detail not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async update(
    @Param('id') id: string,
    @Body() updateOrderDetailDto: Prisma.OrderDetailsUpdateInput,
  ) {
    return this.orderDetailService.update(id, updateOrderDetailDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a order detail' })
  @ApiResponse({
    status: 200,
    description: 'The order detail has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Order detail item not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async remove(@Param('id') id: string) {
    return this.orderDetailService.remove(id)
  }
}
