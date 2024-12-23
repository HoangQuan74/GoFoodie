import { Test, TestingModule } from '@nestjs/testing';
import { DriverUniformsController } from './uniforms.controller';

describe('DriverUniformsController', () => {
  let controller: DriverUniformsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriverUniformsController],
      providers: [],
    }).compile();

    controller = module.get<DriverUniformsController>(DriverUniformsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
