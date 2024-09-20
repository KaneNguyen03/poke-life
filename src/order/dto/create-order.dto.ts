import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { OrderStatus } from '@prisma/client';
import { PaymentMethod, TransactionStatus } from '@prisma/client';
import { CreateOrderDetailDto } from 'src/order-detail/dto/create-order-detail.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  //total price ở đây tính toán từ mảng order detail

  @ApiProperty({
    description: 'Status of the order',
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  orderStatus!: OrderStatus;

  //cái này để tạo transaction
  @ApiProperty({
    description: 'PaymentMethod of the transaction',
    enum: PaymentMethod,
    default: PaymentMethod.COD,
  })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  //amount của transaction cũng tính toán từ orderdetails
  @ApiProperty({
    description: 'Status of the transaction',
    enum: TransactionStatus,
    default: TransactionStatus.Pending,
  })
  @IsNotEmpty()
  @IsEnum(TransactionStatus)
  transactionStatus!: TransactionStatus;

  // Mảng các order details, nếu có
  @ApiProperty({
    description: 'Array of order details',
    type: [CreateOrderDetailDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailDto)
  orderDetails: CreateOrderDetailDto[] | undefined;
}
