import { Test, TestingModule } from '@nestjs/testing';
import { FcmHistoriesController } from './fcm-histories.controller';
import { FcmHistoriesService } from './fcm-histories.service';

describe('FcmHistoriesController', () => {
  let controller: FcmHistoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FcmHistoriesController],
      providers: [FcmHistoriesService],
    }).compile();

    controller = module.get<FcmHistoriesController>(FcmHistoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
