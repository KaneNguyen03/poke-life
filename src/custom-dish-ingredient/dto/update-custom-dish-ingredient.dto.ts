import { PartialType } from '@nestjs/swagger';
import { CreateCustomDishIngredientDto } from './create-custom-dish-ingredient.dto';

export class UpdateCustomDishIngredientDto extends PartialType(CreateCustomDishIngredientDto) {}
