import { Test, TestingModule } from '@nestjs/testing';
import { ComboItemService } from './combo-item.service';

describe('ComboItemService', () => {
  let service: ComboItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComboItemService],
    }).compile();

    service = module.get<ComboItemService>(ComboItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
