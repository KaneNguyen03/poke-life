import { Injectable } from '@nestjs/common';
import { CreateComboItemDto } from './dto/create-combo-item.dto';
import { UpdateComboItemDto } from './dto/update-combo-item.dto';

@Injectable()
export class ComboItemService {
  create(createComboItemDto: CreateComboItemDto) {
    return 'This action adds a new comboItem';
  }

  findAll() {
    return `This action returns all comboItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comboItem`;
  }

  update(id: number, updateComboItemDto: UpdateComboItemDto) {
    return `This action updates a #${id} comboItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} comboItem`;
  }
}
