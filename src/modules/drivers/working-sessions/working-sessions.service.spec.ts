import { Test, TestingModule } from '@nestjs/testing';
import { WorkingSessionsService } from './working-sessions.service';

describe('WorkingSessionsService', () => {
  let service: WorkingSessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkingSessionsService],
    }).compile();

    service = module.get<WorkingSessionsService>(WorkingSessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
