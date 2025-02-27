import { Test, TestingModule } from '@nestjs/testing';
import { ConfigTimesService } from './config-times.service';

describe('ConfigTimesService', () => {
  let service: ConfigTimesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigTimesService],
    }).compile();

    service = module.get<ConfigTimesService>(ConfigTimesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
