import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsString,
  IsPhoneNumber,
} from 'class-validator';
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
    description: 'Name of customer',
    required: false,
  })
  @IsOptional()
  @IsString()
  customerName!: string;

  @ApiProperty({
    description: 'Phone number of the customer',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber!: string;

  @ApiProperty({
    description: 'Received location',
    required: false,
  })
  @IsOptional()
  @IsString()
  address!: string;

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
