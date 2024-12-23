import { Test, TestingModule } from '@nestjs/testing';
import { DriverUniformsService } from './driver-uniforms.service';

describe('DriverUniformsService', () => {
  let service: DriverUniformsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DriverUniformsService],
    }).compile();

    service = module.get<DriverUniformsService>(DriverUniformsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
