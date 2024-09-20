import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CustomDishService } from './custom-dish.service';
// import { CreateCustomDishDto } from './dto/create-custom-dish.dto';
// import { UpdateCustomDishDto } from './dto/update-custom-dish.dto';

import { Prisma } from '@prisma/client'
import { AtStrategy } from 'src/auth/strategies'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('custom-dish')
@ApiBearerAuth()
@UseGuards(AtStrategy)
@Controller('custom-dish')
export class CustomDishController {
  constructor(private readonly customDishService: CustomDishService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new custom dish' })
  @ApiResponse({ status: 201, description: 'The custom dish has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  create(@Body() createCustomDishDto: Prisma.CustomDishesCreateInput) {
    return this.customDishService.create(createCustomDishDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all custom dishes ' })
  @ApiResponse({ status: 200, description: 'List of custom dishes.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findAll() {
    return this.customDishService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a custom dish by ID' })
  @ApiResponse({ status: 200, description: 'The custom dish information.' })
  @ApiResponse({ status: 404, description: 'Custom dish not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findOne(@Param('id') id: string) {
    return this.customDishService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a custom dish' })
  @ApiResponse({ status: 200, description: 'The custom dish information has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Custom dish not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  update(@Param('id') id: string, @Body() updateCustomDishDto: Prisma.CustomDishesUpdateInput) {
    return this.customDishService.update(id, updateCustomDishDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a custom dish' })
  @ApiResponse({ status: 200, description: 'The custom dish has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Custom dishitem not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  remove(@Param('id') id: string) {
    return this.customDishService.remove(id);
  }
}
