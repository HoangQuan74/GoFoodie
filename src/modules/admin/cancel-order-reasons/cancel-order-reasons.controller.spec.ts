import { Test, TestingModule } from '@nestjs/testing';
import { CancelOrderReasonsController } from './cancel-order-reasons.controller';
import { CancelOrderReasonsService } from './cancel-order-reasons.service';

describe('CancelOrderReasonsController', () => {
  let controller: CancelOrderReasonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CancelOrderReasonsController],
      providers: [CancelOrderReasonsService],
    }).compile();

    controller = module.get<CancelOrderReasonsController>(CancelOrderReasonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
