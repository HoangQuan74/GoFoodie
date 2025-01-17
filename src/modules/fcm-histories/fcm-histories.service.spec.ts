import { Test, TestingModule } from '@nestjs/testing';
import { FcmHistoriesService } from './fcm-histories.service';

describe('FcmHistoriesService', () => {
  let service: FcmHistoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FcmHistoriesService],
    }).compile();

    service = module.get<FcmHistoriesService>(FcmHistoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
