import { Test, TestingModule } from '@nestjs/testing';
import { ComboController } from './combo.controller';
import { ComboService } from './combo.service';

describe('ComboController', () => {
  let controller: ComboController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComboController],
      providers: [ComboService],
    }).compile();

    controller = module.get<ComboController>(ComboController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
