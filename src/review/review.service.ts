import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ReviewService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createReviewDto: Prisma.ReviewsCreateInput) {
    return await this.databaseService.reviews.create({ data: createReviewDto });
  }

  async findAll() {
    return await this.databaseService.reviews.findMany();
  }

  async findOne(id: string) {
    return await this.databaseService.reviews.findUnique({
      where: { ReviewID: id },
    });
  }

  async update(id: string, updateReviewDto: Prisma.ReviewsUpdateInput) {
    return await this.databaseService.reviews.update({
      where: { ReviewID: id },
      data: updateReviewDto,
    });
  }

  async remove(id: string) {
    return await this.databaseService.reviews.update({
      where: { ReviewID: id },
      data: {
        IsDeleted: true,
      },
    });
  }
}
