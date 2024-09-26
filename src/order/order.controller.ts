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
} from '@nestjs/common';
import { OrderService } from './order.service';

// import { Prisma } from '@prisma/client';
import { AtStrategy } from 'src/auth/strategies';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GetCurrentUser } from 'src/common/decorators';
import { Order } from './entities/order.entity';
import { RolesGuard } from 'src/common/guards/roles.guard'; // Đảm bảo đường dẫn đúng
import { Roles } from 'src/common/decorators/roles.decorator'; // Đảm bảo đường dẫn đúng
import { UserRole } from 'src/auth/types/user-role.enum';

@ApiTags('order')
@ApiBearerAuth()
@UseGuards(AtStrategy)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(UserRole.Customer) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
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
    user: { userId: string; role: string },
  ) {
    if (!user) throw new ForbiddenException('User ID not found');
    return this.orderService.create(createOrderDto, user.userId);
  }

  @Get()
  @Roles(UserRole.Admin) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Retrieve all orders' })
  @ApiResponse({ status: 200, description: 'List of orders.', type: Order })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiQuery({
    name: 'pageIndex',
    required: false,
    type: Number,
    description: 'Page index, default is 1',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Number of items per page, default is 10',
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
    description: 'Optional search keyword',
  })
  async findAll(
    @Query('pageIndex') pageIndex?: string, // Optional parameter as string
    @Query('pageSize') pageSize?: string, // Optional parameter as string
    @Query('keyword') keyword?: string, // Optional parameter
  ) {
    const parsedPageIndex = parseInt(pageIndex || '', 10);
    const parsedPageSize = parseInt(pageSize || '', 10);

    // Set default values if parsing results in NaN
    const finalPageIndex = isNaN(parsedPageIndex) ? 1 : parsedPageIndex;
    const finalPageSize = isNaN(parsedPageSize) ? 10 : parsedPageSize;
    const finalKeyword = keyword ?? '';
    const orders = await this.orderService.findAll(
      finalPageIndex,
      finalPageSize,
      finalKeyword,
    );
    return orders; // Trả về mảng các đơn hàng
  }

  @Get('customerID')
  @Roles(UserRole.Customer) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Retrieve all orders by customer ID' })
  @ApiResponse({ status: 200, description: 'List all orders of customer.' })
  @ApiResponse({ status: 404, description: 'Orders not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiQuery({
    name: 'pageIndex',
    required: false,
    type: Number,
    description: 'Page index, default is 1',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Number of items per page, default is 10',
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
    description: 'Optional search keyword',
  })
  async findAllByCustomerID(
    @GetCurrentUser()
    user: { userId: string; role: string },
    @Query('pageIndex') pageIndex?: string, // Optional parameter as string
    @Query('pageSize') pageSize?: string, // Optional parameter as string
    @Query('keyword') keyword?: string, // Optional parameter
  ) {
    const parsedPageIndex = parseInt(pageIndex || '', 10);
    const parsedPageSize = parseInt(pageSize || '', 10);

    // Set default values if parsing results in NaN
    const finalPageIndex = isNaN(parsedPageIndex) ? 1 : parsedPageIndex;
    const finalPageSize = isNaN(parsedPageSize) ? 10 : parsedPageSize;
    const finalKeyword = keyword ?? '';
    if (!user) throw new ForbiddenException('User ID not found');
    return this.orderService.findAllByCustomerID(
      user.userId,
      finalPageIndex,
      finalPageSize,
      finalKeyword,
    );
  }

  @Get('detail/:id')
  @Roles(UserRole.Customer) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Retrieve a order details of order by order ID' })
  @ApiResponse({
    status: 200,
    description: 'The order details of a order ID information.',
  })
  @ApiResponse({ status: 404, description: 'Order details not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findDetailOfOneOrder(@Param('id') id: string) {
    return this.orderService.findDetailOfOneOrder(id);
  }

  @Get(':id')
  @Roles(UserRole.Customer) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Retrieve a orders by ID' })
  @ApiResponse({ status: 200, description: 'The orders information.' })
  @ApiResponse({ status: 404, description: 'Orders not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.Customer) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update a status order' })
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
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @Roles(UserRole.Customer) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete a order' })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Order item not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
