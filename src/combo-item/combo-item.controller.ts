import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ComboItemService } from './combo-item.service';


import { Prisma } from '@prisma/client'
import { AtStrategy } from 'src/auth/strategies'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('combo-item')
@ApiBearerAuth()
@UseGuards(AtStrategy)
@Controller('combo-item')
export class ComboItemController {
  constructor(private readonly comboItemService: ComboItemService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new combo item' })
  @ApiResponse({ status: 201, description: 'The combo item has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  create(@Body() createComboItemDto: Prisma.ComboItemsCreateInput) {
    return this.comboItemService.create(createComboItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all combo items' })
  @ApiResponse({ status: 200, description: 'List of combo items.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findAll() {
    return this.comboItemService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a combo item by ID' })
  @ApiResponse({ status: 200, description: 'The combo item information.' })
  @ApiResponse({ status: 404, description: 'Combo item not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findOne(@Param('id') id: string) {
    return this.comboItemService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a combo item' })
  @ApiResponse({ status: 200, description: 'The combo item information has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Combo item not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  update(@Param('id') id: string, @Body() updateComboItemDto: Prisma.ComboItemsUpdateInput) {
    return this.comboItemService.update(id, updateComboItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a combo item' })
  @ApiResponse({ status: 200, description: 'The combo item has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Combo item item not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  remove(@Param('id') id: string) {
    return this.comboItemService.remove(id);
  }
}
