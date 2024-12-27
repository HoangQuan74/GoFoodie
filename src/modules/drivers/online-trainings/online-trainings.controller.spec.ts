import { Test, TestingModule } from '@nestjs/testing';
import { OnlineTrainingsController } from './online-trainings.controller';
import { OnlineTrainingsService } from './online-trainings.service';

describe('OnlineTrainingsController', () => {
  let controller: OnlineTrainingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnlineTrainingsController],
      providers: [OnlineTrainingsService],
    }).compile();

    controller = module.get<OnlineTrainingsController>(OnlineTrainingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
