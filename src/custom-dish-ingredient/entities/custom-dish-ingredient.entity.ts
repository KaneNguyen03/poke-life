import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
export class CustomDishIngredient {
  @ApiProperty({ description: 'Indentified code of the ingredient' })
  @IsNotEmpty()
  @IsString()
  ingredientID!: string;

  @ApiProperty({ description: 'Quantity of the ingredient' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity!: number;
}
