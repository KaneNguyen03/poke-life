import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEnum,
  IsArray,
  ValidateNested,
  IsPhoneNumber,
  IsString,
  IsOptional,
} from 'class-validator';
import { PaymentMethod } from '@prisma/client';
import { CreateOrderDetailDto } from 'src/order-detail/dto/create-order-detail.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  //total price ở đây tính toán từ mảng order detail
  @ApiProperty({
    description: 'Name of customer',
  })
  @IsNotEmpty()
  @IsString()
  customerName!: string;

  @ApiProperty({
    description: 'Phone number of the customer',
  })
  @IsNotEmpty()
  @IsPhoneNumber('VN', {
    message: 'Phone number must be a valid Vietnamese phone number',
  })
  phoneNumber!: string;

  @ApiProperty({
    description: 'Received location',
  })
  @IsNotEmpty()
  @IsString()
  address!: string;

  //cái này để tạo transaction
  @ApiProperty({
    description: 'PaymentMethod of the transaction',
    enum: PaymentMethod,
    default: PaymentMethod.COD,
  })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  // Mảng các order details, nếu có
  @ApiProperty({
    description: 'Array of order details',
    type: [CreateOrderDetailDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailDto)
  orderDetails: CreateOrderDetailDto[] | undefined;

  @ApiProperty({
    description: 'Identified code of combo',
    required: false,
  })
  @IsOptional()
  @IsString()
  comboID?: string;
}
