import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateOrderDetailDto {
  @ApiProperty({ description: 'Identified code of the food' })
  @IsNotEmpty()
  foodID!: string;

  @ApiProperty({ description: 'Quantity of the order detail' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity!: number;
}
