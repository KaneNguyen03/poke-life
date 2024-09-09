import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { FoodService } from './food.service'

import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'
import { AtStrategy } from 'src/auth/strategies'

@ApiTags('food')
@ApiBearerAuth()
@UseGuards(AtStrategy)
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new food item' })
  @ApiResponse({ status: 201, description: 'The food has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createFoodDto: Prisma.FoodCreateInput) {
    return this.foodService.create(createFoodDto)
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all food items' })
  @ApiResponse({ status: 200, description: 'List of food items.' })
  findAll() {
    return this.foodService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a food item by ID' })
  @ApiResponse({ status: 200, description: 'The food item.' })
  @ApiResponse({ status: 404, description: 'Food item not found.' })
  findOne(@Param('id') id: string) {
    return this.foodService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a food item' })
  @ApiResponse({ status: 200, description: 'The food has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Food item not found.' })
  update(@Param('id') id: string, @Body() updateFoodDto: Prisma.FoodUpdateInput) {
    return this.foodService.update(id, updateFoodDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a food item' })
  @ApiResponse({ status: 200, description: 'The food has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Food item not found.' })
  remove(@Param('id') id: string) {
    return this.foodService.remove(id)
  }
}
