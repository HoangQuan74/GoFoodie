import { Test, TestingModule } from '@nestjs/testing';
import { ProductOptionGroupsService } from './product-option-groups.service';

describe('ProductOptionGroupsService', () => {
  let service: ProductOptionGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductOptionGroupsService],
    }).compile();

    service = module.get<ProductOptionGroupsService>(ProductOptionGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
