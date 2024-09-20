import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsOptional, IsNumber, Min, IsDecimal } from 'class-validator';


export class CreateFoodDto {
    @ApiProperty({ description: 'Name of the food' })
    @IsNotEmpty()
    @IsString()
    name!: string;
  
    @ApiProperty({ description: 'Description of the food', required: false })
    @IsOptional()
    @IsString()
    description?: string;
  
    @ApiProperty({ description: 'Price of the food' })
    @IsNotEmpty()
    @IsDecimal({ decimal_digits: '2', force_decimal: true })
    @Min(1)
    price!: number;
  
    @ApiProperty({ description: 'Calories of the food' })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    calories!: number;
  
    @ApiProperty({ description: 'Image URL of the food', required: false })
    @IsOptional()
    @IsString()
    image?: string;
  }