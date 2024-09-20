import { Test, TestingModule } from '@nestjs/testing';
import { CustomDishController } from './custom-dish.controller';
import { CustomDishService } from './custom-dish.service';

describe('CustomDishController', () => {
  let controller: CustomDishController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomDishController],
      providers: [CustomDishService],
    }).compile();

    controller = module.get<CustomDishController>(CustomDishController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
