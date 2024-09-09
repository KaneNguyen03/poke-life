import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComboItemService } from './combo-item.service';
import { CreateComboItemDto } from './dto/create-combo-item.dto';
import { UpdateComboItemDto } from './dto/update-combo-item.dto';

@Controller('combo-item')
export class ComboItemController {
  constructor(private readonly comboItemService: ComboItemService) {}

  @Post()
  create(@Body() createComboItemDto: CreateComboItemDto) {
    return this.comboItemService.create(createComboItemDto);
  }

  @Get()
  findAll() {
    return this.comboItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comboItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComboItemDto: UpdateComboItemDto) {
    return this.comboItemService.update(+id, updateComboItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comboItemService.remove(+id);
  }
}
