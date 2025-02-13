import { Test, TestingModule } from '@nestjs/testing';
import { PreparationTimesController } from './preparation-times.controller';
import { PreparationTimesService } from './preparation-times.service';

describe('PreparationTimesController', () => {
  let controller: PreparationTimesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreparationTimesController],
      providers: [PreparationTimesService],
    }).compile();

    controller = module.get<PreparationTimesController>(PreparationTimesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
