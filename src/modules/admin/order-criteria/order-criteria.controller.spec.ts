import { Test, TestingModule } from '@nestjs/testing';
import { OrderCriteriaController } from './order-criteria.controller';
import { OrderCriteriaService } from './order-criteria.service';

describe('OrderCriteriaController', () => {
  let controller: OrderCriteriaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderCriteriaController],
      providers: [OrderCriteriaService],
    }).compile();

    controller = module.get<OrderCriteriaController>(OrderCriteriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
