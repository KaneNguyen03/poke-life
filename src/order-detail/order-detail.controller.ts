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
} from '@nestjs/common';
import { OrderDetailService } from './order-detail.service';

import { Prisma } from '@prisma/client';
import { AtStrategy } from 'src/auth/strategies';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('order-detail')
@ApiBearerAuth()
@UseGuards(AtStrategy)
@Controller('order-detail')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order detail' })
  @ApiResponse({
    status: 201,
    description: 'The order detail has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async create(@Body() createOrderDetailDto: Prisma.OrderDetailsCreateInput) {
    return this.orderDetailService.create(createOrderDetailDto);
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
    return this.orderDetailService.findAll(pageIndex, pageSize, keyword);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a order detail by ID' })
  @ApiResponse({ status: 200, description: 'The order detail information.' })
  @ApiResponse({ status: 404, description: 'Order detail not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findOne(@Param('id') id: string) {
    return this.orderDetailService.findOne(id);
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
    return this.orderDetailService.update(id, updateOrderDetailDto);
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
    return this.orderDetailService.remove(id);
  }
}
