import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';


export class CreateReviewDto {
    @ApiProperty({ description: 'Identified code of the customer' })
    @IsNotEmpty()
    @IsString()
    customerID!: string;
  
    @ApiProperty({ description: 'Identified code of the food'})
    @IsNotEmpty()
    @IsString()
    foodID!: string;
  
    @ApiProperty({ description: 'Rating of the review' })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating!: number;

    @ApiProperty({ description: 'Comment of the review', required: false})
    @IsOptional()
    @IsString()
    comment?: string;
  }