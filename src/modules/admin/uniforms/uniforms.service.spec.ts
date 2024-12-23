import { Test, TestingModule } from '@nestjs/testing';
import { UniformsService } from './uniforms.service';

describe('UniformsService', () => {
  let service: UniformsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UniformsService],
    }).compile();

    service = module.get<UniformsService>(UniformsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
