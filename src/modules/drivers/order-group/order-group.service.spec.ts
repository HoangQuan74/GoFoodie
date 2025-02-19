import { Test, TestingModule } from '@nestjs/testing';
import { OrderGroupService } from './order-group.service';

describe('OrderGroupService', () => {
  let service: OrderGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderGroupService],
    }).compile();

    service = module.get<OrderGroupService>(OrderGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
