import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';
import { CreateCustomDishIngredientDto } from 'src/custom-dish-ingredient/dto/create-custom-dish-ingredient.dto';
import { CustomDishIngredient } from 'src/custom-dish-ingredient/entities/custom-dish-ingredient.entity';

export class CreateFoodDto {
  @ApiProperty({ description: 'Name of the food' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Description of the food', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  // @ApiProperty({ description: 'Price of the food' })
  // @IsNotEmpty()
  // @IsDecimal({ decimal_digits: '2', force_decimal: true })
  // @Min(1)
  // price!: number;

  @ApiProperty({ description: 'Price of the food' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseFloat(parseFloat(value).toFixed(2))) // Chuyển đổi thành số thập phân với 2 chữ số
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

export class CreateCustomFoodDto {
  // Mảng các ingredientList
  @ApiProperty({
    description: 'Array of ingredient ID and its quantity',
    type: [CustomDishIngredient],
  })
  @IsArray()
  @ArrayNotEmpty() // Đảm bảo mảng không rỗng
  @ValidateNested({ each: true })
  @Type(() => CreateCustomDishIngredientDto)
  ingredientList: CreateCustomDishIngredientDto[] | undefined;

  @ApiProperty({ description: 'Name of the custom food' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Description of the food', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Image URL of the custom food', required: false })
  @IsOptional()
  @IsString()
  image?: string;
}
