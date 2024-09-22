import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, Min, IsDecimal } from 'class-validator';
import { PaymentMethod, TransactionStatus } from '@prisma/client';

export class CreateTransactionDto {
  @ApiProperty({ description: 'Identified code of the order' })
  @IsNotEmpty()
  orderID!: string;

  @ApiProperty({
    description: 'PaymentMethod of the transaction',
    enum: PaymentMethod,
    default: PaymentMethod.COD,
  })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiProperty({ description: 'Amount of the transaction' })
  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '2', force_decimal: true })
  @Min(1)
  amount!: number;

  @ApiProperty({
    description: 'Status of the transaction',
    enum: TransactionStatus,
    default: TransactionStatus.Pending,
  })
  @IsNotEmpty()
  @IsEnum(TransactionStatus)
  transactionStatus!: TransactionStatus;
}
