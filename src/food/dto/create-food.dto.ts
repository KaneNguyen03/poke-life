import { ApiProperty } from '@nestjs/swagger'

export class CreateFoodDto {
    @ApiProperty({ description: 'Name of the food' })
    name!: string

    @ApiProperty({ description: 'Description of the food', required: false })
    description?: string

    @ApiProperty({ description: 'Price of the food' })
    price!: number

    @ApiProperty({ description: 'Calories of the food' })
    calories!: number
}
