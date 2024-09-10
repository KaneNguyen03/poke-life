import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client'
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ReviewService {
  constructor(private readonly databaseService: DatabaseService) { }
  create(createReviewDto: Prisma.ReviewsCreateInput) {
    return this.databaseService.reviews.create({ data: createReviewDto })

  }

  findAll() {
    return this.databaseService.reviews.findMany()
  }

  findOne(id: string) {
    return this.databaseService.reviews.findUnique({ where: { ReviewID: id } })

  }

  update(id: string, updateReviewDto: Prisma.ReviewsUpdateInput) {
    return this.databaseService.reviews.update({ where: { ReviewID: id }, data: updateReviewDto })

  }

  remove(id: string) {
    return this.databaseService.reviews.delete({ where: { ReviewID: id } })

  }
}
