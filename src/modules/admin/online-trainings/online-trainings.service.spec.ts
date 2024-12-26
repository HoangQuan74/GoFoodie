import { Test, TestingModule } from '@nestjs/testing';
import { OnlineTrainingsService } from './online-trainings.service';

describe('OnlineTrainingsService', () => {
  let service: OnlineTrainingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnlineTrainingsService],
    }).compile();

    service = module.get<OnlineTrainingsService>(OnlineTrainingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
