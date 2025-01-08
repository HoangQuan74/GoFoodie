import { Test, TestingModule } from '@nestjs/testing';
import { WorkingSessionsController } from './working-sessions.controller';
import { WorkingSessionsService } from './working-sessions.service';

describe('WorkingSessionsController', () => {
  let controller: WorkingSessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkingSessionsController],
      providers: [WorkingSessionsService],
    }).compile();

    controller = module.get<WorkingSessionsController>(WorkingSessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
