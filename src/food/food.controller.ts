import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FoodService } from './food.service';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { AtStrategy } from 'src/auth/strategies';
import { GetCurrentUser, Public } from 'src/common/decorators';
import { CreateFoodDto, CreateCustomFoodDto } from './dto/create-food.dto';

import { RolesGuard } from 'src/common/guards/roles.guard'; // Đảm bảo đường dẫn đúng
import { Roles } from 'src/common/decorators/roles.decorator'; // Đảm bảo đường dẫn đúng
import { UserRole } from 'src/auth/types/user-role.enum';

@ApiTags('food')
@ApiBearerAuth()
@UseGuards(AtStrategy)
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post()
  @Roles(UserRole.Admin) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create a new food item' })
  @ApiResponse({
    status: 201,
    description: 'The food has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async create(@Body() createFoodDto: CreateFoodDto) {
    return this.foodService.create(createFoodDto);
  }

  @Post('customDish')
  @Roles(UserRole.Customer) // cus trở lên có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create a new custom food item' })
  @ApiResponse({
    status: 201,
    description: 'The custom food has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async createCustomDish(@Body() createFoodDto: CreateCustomFoodDto) {
    return this.foodService.createCustomDish(createFoodDto);
  }

  @Public()
  @Get()
  // @Roles(UserRole.Admin) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Retrieve all food items' })
  @ApiResponse({ status: 200, description: 'List of food items.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
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

    return this.foodService.findAll(
      finalPageIndex,
      finalPageSize,
      finalKeyword,
    );
  }

  // @Public()
  @Get('customer')
  @Roles(UserRole.Customer) // cus trở lên có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Retrieve all food items for customer' })
  @ApiResponse({ status: 200, description: 'List of food items.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAllForCustomer(
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

    return this.foodService.findAllForCustomer(
      finalPageIndex,
      finalPageSize,
      finalKeyword,
    );
  }

  // @Public()

  @Get('customFoodOfCustomer')
  @Roles(UserRole.Customer) // cus trở lên có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Retrieve all custom food items of a customer' })
  @ApiResponse({
    status: 200,
    description: 'List of custom food of a customer.',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAllCustomFoodOfCustomer(
    @GetCurrentUser()
    user: { userId: string; role: string },
  ) {
    if (!user) throw new ForbiddenException('User ID not found');
    return this.foodService.findAllCustomFoodOfCustomer(user.userId);
  }

  @Get(':id')
  @Roles(UserRole.Customer) // cus trở lên có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Retrieve a food item by ID' })
  @ApiResponse({ status: 200, description: 'The food item.' })
  @ApiResponse({ status: 404, description: 'Food item not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findOne(@Param('id') id: string) {
    return this.foodService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.Admin) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update a food item' })
  @ApiResponse({
    status: 200,
    description: 'The food has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Food item not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async update(
    @Param('id') id: string,
    @Body() updateFoodDto: Prisma.FoodUpdateInput,
  ) {
    return this.foodService.update(id, updateFoodDto);
  }

  @Delete(':id')
  @Roles(UserRole.Admin) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete a food item' })
  @ApiResponse({
    status: 200,
    description: 'The food has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Food item not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async remove(@Param('id') id: string) {
    return this.foodService.remove(id);
  }
}
