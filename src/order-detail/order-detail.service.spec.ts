import { Test, TestingModule } from '@nestjs/testing';
import { OrderDetailService } from './order-detail.service';

describe('OrderDetailService', () => {
  let service: OrderDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderDetailService],
    }).compile();

    service = module.get<OrderDetailService>(OrderDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
