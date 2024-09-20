import { Test, TestingModule } from '@nestjs/testing';
import { CustomDishService } from './custom-dish.service';

describe('CustomDishService', () => {
  let service: CustomDishService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomDishService],
    }).compile();

    service = module.get<CustomDishService>(CustomDishService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
