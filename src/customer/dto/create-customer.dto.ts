import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, IsOptional, IsString, IsEmail, IsPhoneNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCustomerDto {
  @ApiProperty({ description: 'Full name of the customer' })
  @IsNotEmpty()
  @IsString()
  fullName!: string;

  @ApiProperty({ description: 'Date of birth of the customer', required: false })
  @IsNotEmpty()
  @Matches(/^\d{4}\/\d{2}\/\d{2}$/, { message: 'Date must be in the format yyyy/mm/dd' })
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  dateOfBirth!: string;

  @ApiProperty({ description: 'Email of the customer' })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Phone number of the customer' })
  @IsNotEmpty()
  @IsPhoneNumber()  // Kiểm tra định dạng số điện thoại
  phoneNumber!: string;

  @ApiProperty({ description: 'Address of the customer', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}
