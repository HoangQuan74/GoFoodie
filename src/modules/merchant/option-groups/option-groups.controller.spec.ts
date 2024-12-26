import { Test, TestingModule } from '@nestjs/testing';
import { OptionGroupsController } from './option-groups.controller';
import { OptionGroupsService } from './option-groups.service';

describe('OptionGroupsController', () => {
  let controller: OptionGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OptionGroupsController],
      providers: [OptionGroupsService],
    }).compile();

    controller = module.get<OptionGroupsController>(OptionGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
