import { Test, TestingModule } from '@nestjs/testing';
import { CustomDishIngredientService } from './custom-dish-ingredient.service';

describe('CustomDishIngredientService', () => {
  let service: CustomDishIngredientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomDishIngredientService],
    }).compile();

    service = module.get<CustomDishIngredientService>(CustomDishIngredientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
