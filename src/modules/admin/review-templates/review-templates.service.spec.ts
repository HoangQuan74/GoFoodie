import { Test, TestingModule } from '@nestjs/testing';
import { ReviewTemplatesService } from './review-templates.service';

describe('ReviewTemplatesService', () => {
  let service: ReviewTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewTemplatesService],
    }).compile();

    service = module.get<ReviewTemplatesService>(ReviewTemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
