import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';

import { Prisma } from '@prisma/client';
import { AtStrategy } from 'src/auth/strategies';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard'; // Đảm bảo đường dẫn đúng
import { Roles } from 'src/common/decorators/roles.decorator'; // Đảm bảo đường dẫn đúng
import { UserRole } from 'src/auth/types/user-role.enum';

@ApiTags('review')
@ApiBearerAuth()
@UseGuards(AtStrategy)
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @Roles(UserRole.Customer) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({
    status: 201,
    description: 'The review has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async create(@Body() createReviewDto: Prisma.ReviewsCreateInput) {
    return this.reviewService.create(createReviewDto);
  }

  @Get()
  @Roles(UserRole.Customer) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Retrieve all reviews' })
  @ApiResponse({ status: 200, description: 'List of reviews.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAll() {
    return this.reviewService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.Customer) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Retrieve a review by ID' })
  @ApiResponse({ status: 200, description: 'The review information.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.Customer) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update a review information' })
  @ApiResponse({
    status: 200,
    description: 'The review information has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: Prisma.ReviewsUpdateInput,
  ) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @Roles(UserRole.Admin) // Chỉ admin có quyền truy cập
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete a review' })
  @ApiResponse({
    status: 200,
    description: 'The review has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Review item not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }
}
