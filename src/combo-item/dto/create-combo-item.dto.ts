import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateComboItemDto {
  @ApiProperty({ description: 'Identified code of the combo' })
  @IsNotEmpty()
  comboID!: string;

  @ApiProperty({ description: 'Identified code of the food' })
  @IsNotEmpty()
  foodID!: string;

  @ApiProperty({ description: 'Quantity of the combo item' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity!: number;
}
