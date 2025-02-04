import { Test, TestingModule } from '@nestjs/testing';
import { ReviewTemplatesController } from './review-templates.controller';
import { ReviewTemplatesService } from './review-templates.service';

describe('ReviewTemplatesController', () => {
  let controller: ReviewTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewTemplatesController],
      providers: [ReviewTemplatesService],
    }).compile();

    controller = module.get<ReviewTemplatesController>(ReviewTemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
