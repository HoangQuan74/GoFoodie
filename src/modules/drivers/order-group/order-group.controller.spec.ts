import { Test, TestingModule } from '@nestjs/testing';
import { OrderGroupController } from './order-group.controller';
import { OrderGroupService } from './order-group.service';

describe('OrderGroupController', () => {
  let controller: OrderGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderGroupController],
      providers: [OrderGroupService],
    }).compile();

    controller = module.get<OrderGroupController>(OrderGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
