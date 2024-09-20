import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsOptional, IsNumber, Min, IsDecimal } from 'class-validator';


export class CreateIngredientDto {
    @ApiProperty({ description: 'Name of the ingredient' })
    @IsNotEmpty()
    @IsString()
    name!: string;
  
    @ApiProperty({ description: 'Description of the ingredient', required: false })
    @IsOptional()
    @IsString()
    description?: string;
  
    @ApiProperty({ description: 'Calories of the ingredient' })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    calories!: number;

    @ApiProperty({ description: 'Price of the ingredient' })
    @IsNotEmpty()
    @IsDecimal({ decimal_digits: '2', force_decimal: true })
    @Min(1)
    price!: number;
  }