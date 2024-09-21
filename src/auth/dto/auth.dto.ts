import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class SignupDto {
  @ApiProperty({ description: 'User email' })
  @IsNotEmpty()
  @IsString()
  email!: string

  @ApiProperty({ description: 'User password' })
  @IsNotEmpty()
  @IsString()
  password!: string

  @ApiProperty({ description: 'Username' })
  @IsNotEmpty()
  @IsString()
  username!: string

  @ApiProperty({ description: 'Phone number' })
  @IsNotEmpty()
  @IsString()
  phoneNumber!: string

  @ApiProperty({ description: 'Address' })
  @IsNotEmpty()
  @IsString()
  address!: string
}

export class SigninDto {
  @ApiProperty({ description: 'User email' })
  @IsNotEmpty()
  @IsString()
  email!: string

  @ApiProperty({ description: 'User password' })
  @IsNotEmpty()
  @IsString()
  password!: string
}