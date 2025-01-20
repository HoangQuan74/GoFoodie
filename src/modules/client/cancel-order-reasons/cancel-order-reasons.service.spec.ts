import { Test, TestingModule } from '@nestjs/testing';
import { CancelOrderReasonsService } from './cancel-order-reasons.service';

describe('CancelOrderReasonsService', () => {
  let service: CancelOrderReasonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CancelOrderReasonsService],
    }).compile();

    service = module.get<CancelOrderReasonsService>(CancelOrderReasonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
