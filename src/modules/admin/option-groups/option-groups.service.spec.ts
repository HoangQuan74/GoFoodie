import { Test, TestingModule } from '@nestjs/testing';
import { OptionGroupsService } from './option-groups.service';

describe('OptionGroupsService', () => {
  let service: OptionGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OptionGroupsService],
    }).compile();

    service = module.get<OptionGroupsService>(OptionGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
