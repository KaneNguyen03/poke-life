import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '@prisma/client';
import { PaymentMethod } from '@prisma/client';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'Status of the order',
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  orderStatus!: OrderStatus;

  @ApiProperty({
    description: 'PaymentMethod of the transaction',
    enum: PaymentMethod,
    default: PaymentMethod.COD,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;
}
