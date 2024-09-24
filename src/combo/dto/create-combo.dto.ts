import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { CreateComboItemDto } from 'src/combo-item/dto/create-combo-item.dto';
import { ComboItem } from 'src/combo-item/entities/combo-item.entity';

export class CreateComboDto {
  @ApiProperty({ description: 'Name of the combo' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Description of the food', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Image of the combo', required: false })
  @IsOptional()
  @IsString()
  imageURL?: string;

  // Mảng các combo items
  @ApiProperty({
    description: 'Array of food ID and its quantity',
    type: [ComboItem],
  })
  @IsArray()
  @ArrayNotEmpty() // Đảm bảo mảng không rỗng
  @ValidateNested({ each: true })
  @Type(() => CreateComboItemDto)
  itemList: CreateComboItemDto[] | undefined;
}
