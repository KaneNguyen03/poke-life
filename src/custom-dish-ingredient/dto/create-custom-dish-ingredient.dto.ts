import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateCustomDishIngredientDto {
  @ApiProperty({ description: 'Identified code of the custom dish' })
  @IsNotEmpty()
  customDishID!: string;

  @ApiProperty({ description: 'Identified code of the ingredient' })
  @IsNotEmpty()
  ingredientID!: string;

  @ApiProperty({ description: 'Quantity of the custom dish ingredient' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity!: number;
}
