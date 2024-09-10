import { ApiProperty } from '@nestjs/swagger'

export class CreateCustomerDto {
    @ApiProperty({ description: 'Fullname of customer' })
    fullName!: string

    @ApiProperty({ description: 'Birthday of customer', required: false })
    dateOfBirth?: Date

    @ApiProperty({ description: 'Email of customer' })
    email!: string

    @ApiProperty({ description: 'Phone number of customer' })
    phoneNumber!: string

    @ApiProperty({ description: 'Address of customer', required: false })
    address?: string
}
