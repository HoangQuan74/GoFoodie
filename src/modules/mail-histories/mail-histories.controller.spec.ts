import { Test, TestingModule } from '@nestjs/testing';
import { MailHistoriesController } from './mail-histories.controller';
import { MailHistoriesService } from './mail-histories.service';

describe('MailHistoriesController', () => {
  let controller: MailHistoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailHistoriesController],
      providers: [MailHistoriesService],
    }).compile();

    controller = module.get<MailHistoriesController>(MailHistoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
