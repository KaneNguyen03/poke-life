import { Test, TestingModule } from '@nestjs/testing';
import { CustomDishIngredientController } from './custom-dish-ingredient.controller';
import { CustomDishIngredientService } from './custom-dish-ingredient.service';

describe('CustomDishIngredientController', () => {
  let controller: CustomDishIngredientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomDishIngredientController],
      providers: [CustomDishIngredientService],
    }).compile();

    controller = module.get<CustomDishIngredientController>(CustomDishIngredientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
