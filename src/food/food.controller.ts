import {
  Body,
  Controller,
  Delete,
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
import { Public } from 'src/common/decorators';
import { CreateFoodDto, CreateCustomFoodDto } from './dto/create-food.dto';

@ApiTags('food')
@ApiBearerAuth()
@UseGuards(AtStrategy)
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post()
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
  @ApiOperation({ summary: 'Retrieve all food items' })
  @ApiResponse({ status: 200, description: 'List of food items.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAll(
    @Query('pageIndex') pageIndex: number = 1, // Mặc định là trang 1
    @Query('pageSize') pageSize: number = 10, // Mặc định là 10 mục trên mỗi trang
    @Query('keyword') keyword?: string, // Từ khóa tìm kiếm tùy chọn
  ) {
    return this.foodService.findAll(pageIndex, pageSize, keyword);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a food item by ID' })
  @ApiResponse({ status: 200, description: 'The food item.' })
  @ApiResponse({ status: 404, description: 'Food item not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findOne(@Param('id') id: string) {
    return this.foodService.findOne(id);
  }

  @Patch(':id')
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
