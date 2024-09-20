import { PartialType } from '@nestjs/swagger';
import { CreateCustomDishDto } from './create-custom-dish.dto';

export class UpdateCustomDishDto extends PartialType(CreateCustomDishDto) {}
