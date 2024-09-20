import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, Min, IsUUID } from 'class-validator';


export class CreateCustomDishIngredientDto {
    @ApiProperty({ description: 'Identified code of the custom dish' })
    @IsNotEmpty()
    @IsUUID()
    customDishID!: string;
  
    @ApiProperty({ description: 'Identified code of the ingredient'})
    @IsNotEmpty()
    @IsUUID()
    ingredientID!: string;
  
    @ApiProperty({ description: 'Quantity of the custom dish ingredient' })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity!: number;
  }