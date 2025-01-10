import { Test, TestingModule } from '@nestjs/testing';
import { StoreAddressesService } from './store-addresses.service';

describe('StoreAddressesService', () => {
  let service: StoreAddressesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreAddressesService],
    }).compile();

    service = module.get<StoreAddressesService>(StoreAddressesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
