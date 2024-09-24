import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateIngredientDto {
  @ApiProperty({ description: 'Name of the ingredient' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Description of the ingredient',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Calories of the ingredient' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  calories!: number;

  @ApiProperty({ description: 'Price of the ingredient' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(parseFloat(value).toFixed(2))) // Chuyển đổi thành số thập phân với 2 chữ số
  price!: number;

  @ApiProperty({ description: 'Image URL of the ingredient', required: false })
  @IsOptional()
  @IsString()
  image?: string;
}
