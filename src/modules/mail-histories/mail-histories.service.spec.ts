import { Test, TestingModule } from '@nestjs/testing';
import { MailHistoriesService } from './mail-histories.service';

describe('MailHistoriesService', () => {
  let service: MailHistoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailHistoriesService],
    }).compile();

    service = module.get<MailHistoriesService>(MailHistoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
