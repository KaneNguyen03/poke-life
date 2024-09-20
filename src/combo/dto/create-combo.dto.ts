import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsOptional, Min, IsDecimal } from 'class-validator';


export class CreateComboDto {
    @ApiProperty({ description: 'Name of the combo' })
    @IsNotEmpty()
    @IsString()
    name!: string;
  
    @ApiProperty({ description: 'Description of the food', required: false })
    @IsOptional()
    @IsString()
    description?: string;
  
    @ApiProperty({ description: 'Price of the combo' })
    @IsNotEmpty()
    @IsDecimal({ decimal_digits: '2', force_decimal: true })
    @Min(1)
    price!: number;
}
