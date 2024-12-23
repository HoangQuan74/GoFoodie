import { Test, TestingModule } from '@nestjs/testing';
import { DriverUniformsController } from './driver-uniforms.controller';
import { DriverUniformsService } from './driver-uniforms.service';

describe('DriverUniformsController', () => {
  let controller: DriverUniformsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriverUniformsController],
      providers: [DriverUniformsService],
    }).compile();

    controller = module.get<DriverUniformsController>(DriverUniformsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
