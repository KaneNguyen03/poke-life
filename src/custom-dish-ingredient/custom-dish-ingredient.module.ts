import { Module } from '@nestjs/common';
import { CustomDishIngredientService } from './custom-dish-ingredient.service';
import { CustomDishIngredientController } from './custom-dish-ingredient.controller';
import { DatabaseModule } from 'src/database/database.module';
@Module({
  imports: [DatabaseModule],
  controllers: [CustomDishIngredientController],
  providers: [CustomDishIngredientService],
})
export class CustomDishIngredientModule {}
