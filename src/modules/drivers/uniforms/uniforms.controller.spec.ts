import { Test, TestingModule } from '@nestjs/testing';
import { UniformsController } from './uniforms.controller';
import { UniformsService } from './uniforms.service';

describe('UniformsController', () => {
  let controller: UniformsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UniformsController],
      providers: [UniformsService],
    }).compile();

    controller = module.get<UniformsController>(UniformsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
