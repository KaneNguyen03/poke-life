import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsOptional, IsNumber, Min, IsDecimal, IsUUID } from 'class-validator';


export class CreateCustomDishDto {
    @ApiProperty({ description: 'Identified code of the customer' })
    @IsNotEmpty()
    @IsUUID()
    customerID!: string;
  
    @ApiProperty({ description: 'Name of the custom dish'})
    @IsNotEmpty()
    @IsString()
    name!: string;
  
    @ApiProperty({ description: 'Description of the food', required: false})
    @IsOptional()
    @IsString()
    description?: string;
  
    @ApiProperty({ description: 'Total price of the custom dish' })
    @IsNotEmpty()
    @IsDecimal({ decimal_digits: '2', force_decimal: true })
    @Min(1)
    totalPrice!: number;
  
    @ApiProperty({ description: 'Total calories of the custom dish' })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    totalCalories!: number;
  }