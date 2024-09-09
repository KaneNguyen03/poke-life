import { Injectable } from '@nestjs/common';
import { CreateComboDto } from './dto/create-combo.dto';
import { UpdateComboDto } from './dto/update-combo.dto';

@Injectable()
export class ComboService {
  create(createComboDto: CreateComboDto) {
    return 'This action adds a new combo';
  }

  findAll() {
    return `This action returns all combo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} combo`;
  }

  update(id: number, updateComboDto: UpdateComboDto) {
    return `This action updates a #${id} combo`;
  }

  remove(id: number) {
    return `This action removes a #${id} combo`;
  }
}
