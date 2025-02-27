import { Test, TestingModule } from '@nestjs/testing';
import { ConfigTimesController } from './config-times.controller';
import { ConfigTimesService } from './config-times.service';

describe('ConfigTimesController', () => {
  let controller: ConfigTimesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfigTimesController],
      providers: [ConfigTimesService],
    }).compile();

    controller = module.get<ConfigTimesController>(ConfigTimesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
