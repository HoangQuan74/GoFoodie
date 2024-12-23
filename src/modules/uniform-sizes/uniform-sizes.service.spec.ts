import { Test, TestingModule } from '@nestjs/testing';
import { UniformSizesService } from './uniform-sizes.service';

describe('UniformSizesService', () => {
  let service: UniformSizesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UniformSizesService],
    }).compile();

    service = module.get<UniformSizesService>(UniformSizesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
