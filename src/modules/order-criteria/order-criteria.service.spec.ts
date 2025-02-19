import { Test, TestingModule } from '@nestjs/testing';
import { OrderCriteriaService } from './order-criteria.service';

describe('OrderCriteriaService', () => {
  let service: OrderCriteriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderCriteriaService],
    }).compile();

    service = module.get<OrderCriteriaService>(OrderCriteriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
