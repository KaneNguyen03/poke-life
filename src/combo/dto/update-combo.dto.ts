import { PartialType } from '@nestjs/swagger';
import { CreateComboDto } from './create-combo.dto';

export class UpdateComboDto extends PartialType(CreateComboDto) {}
