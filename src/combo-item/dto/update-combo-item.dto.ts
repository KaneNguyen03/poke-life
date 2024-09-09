import { PartialType } from '@nestjs/swagger';
import { CreateComboItemDto } from './create-combo-item.dto';

export class UpdateComboItemDto extends PartialType(CreateComboItemDto) {}
