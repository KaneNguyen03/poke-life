import { Module } from '@nestjs/common';
import { CustomDishService } from './custom-dish.service';
import { CustomDishController } from './custom-dish.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CustomDishController],
  providers: [CustomDishService],
})
export class CustomDishModule {}
