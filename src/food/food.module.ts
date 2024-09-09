import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database/database.module'
import { FoodController } from './food.controller'
import { FoodService } from './food.service'

@Module({
  imports: [DatabaseModule],
  controllers: [FoodController],
  providers: [FoodService],
})
export class FoodModule { }
