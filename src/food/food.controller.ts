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
} from '@nestjs/common'
import { FoodService } from './food.service'

import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Prisma } from '@prisma/client'
import { AtStrategy } from 'src/auth/strategies'
import { Public } from 'src/common/decorators'
import { CreateFoodDto, CreateCustomFoodDto } from './dto/create-food.dto'

@ApiTags('food')
@ApiBearerAuth()
@UseGuards(AtStrategy)
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new food item' })
  @ApiResponse({
    status: 201,
    description: 'The food has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async create(@Body() createFoodDto: CreateFoodDto) {
    return this.foodService.create(createFoodDto)
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
    return this.foodService.createCustomDish(createFoodDto)
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Retrieve all food items' })
  @ApiResponse({ status: 200, description: 'List of food items.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiQuery({ name: 'pageIndex', required: false, type: Number, description: 'Page index, default is 1' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Number of items per page, default is 10' })
  @ApiQuery({ name: 'keyword', required: false, type: String, description: 'Optional search keyword' })
  async findAll(
    @Query('pageIndex') pageIndex?: string, // Optional parameter as string
    @Query('pageSize') pageSize?: string, // Optional parameter as string
    @Query('keyword') keyword?: string, // Optional parameter
  ) {
    // Parse the query parameters to integers and apply default values if parsing fails
    const parsedPageIndex = parseInt(pageIndex || '', 10)
    const parsedPageSize = parseInt(pageSize || '', 10)

    // Set default values if parsing results in NaN
    const finalPageIndex = isNaN(parsedPageIndex) ? 1 : parsedPageIndex
    const finalPageSize = isNaN(parsedPageSize) ? 10 : parsedPageSize
    const finalKeyword = keyword ?? ''

    return this.foodService.findAll(finalPageIndex, finalPageSize, finalKeyword)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a food item by ID' })
  @ApiResponse({ status: 200, description: 'The food item.' })
  @ApiResponse({ status: 404, description: 'Food item not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findOne(@Param('id') id: string) {
    return this.foodService.findOne(id)
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
    return this.foodService.update(id, updateFoodDto)
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
    return this.foodService.remove(id)
  }
}
