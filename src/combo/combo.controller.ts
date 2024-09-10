import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ComboService } from './combo.service';


import { Prisma } from '@prisma/client'
import { AtStrategy } from 'src/auth/strategies'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('combo')
@ApiBearerAuth()
@UseGuards(AtStrategy)
@Controller('combo')
export class ComboController {
  constructor(private readonly comboService: ComboService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new combo' })
  @ApiResponse({ status: 201, description: 'The combo has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  create(@Body() createComboDto: Prisma.CombosCreateInput) {
    return this.comboService.create(createComboDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all combos' })
  @ApiResponse({ status: 200, description: 'List of combos.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findAll() {
    return this.comboService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a combo by ID' })
  @ApiResponse({ status: 200, description: 'The combo information.' })
  @ApiResponse({ status: 404, description: 'Combo not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findOne(@Param('id') id: string) {
    return this.comboService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a combo information' })
  @ApiResponse({ status: 200, description: 'The combo information has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Combo not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  update(@Param('id') id: string, @Body() updateComboDto: Prisma.CombosUpdateInput) {
    return this.comboService.update(id, updateComboDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a combo' })
  @ApiResponse({ status: 200, description: 'The combo has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Combo item not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  remove(@Param('id') id: string) {
    return this.comboService.remove(id);
  }
}
