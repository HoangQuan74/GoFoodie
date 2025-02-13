import { Test, TestingModule } from '@nestjs/testing';
import { PreparationTimesService } from './preparation-times.service';

describe('PreparationTimesService', () => {
  let service: PreparationTimesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreparationTimesService],
    }).compile();

    service = module.get<PreparationTimesService>(PreparationTimesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
