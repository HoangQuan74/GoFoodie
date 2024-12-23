import { Test, TestingModule } from '@nestjs/testing';
import { UniformSizesController } from './uniform-sizes.controller';
import { UniformSizesService } from './uniform-sizes.service';

describe('UniformSizesController', () => {
  let controller: UniformSizesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UniformSizesController],
      providers: [UniformSizesService],
    }).compile();

    controller = module.get<UniformSizesController>(UniformSizesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
