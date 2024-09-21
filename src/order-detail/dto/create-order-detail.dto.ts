import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, Min, IsDecimal, IsUUID } from 'class-validator'

export class CreateOrderDetailDto {
  @ApiProperty({ description: 'Identified code of the food' })
  @IsNotEmpty()
  @IsUUID()
  foodID!: string

  @ApiProperty({ description: 'Quantity of the order detail' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity!: number

}