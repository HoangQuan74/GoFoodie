import { Test, TestingModule } from '@nestjs/testing';
import { StoreAddressesController } from './store-addresses.controller';
import { StoreAddressesService } from './store-addresses.service';

describe('StoreAddressesController', () => {
  let controller: StoreAddressesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreAddressesController],
      providers: [StoreAddressesService],
    }).compile();

    controller = module.get<StoreAddressesController>(StoreAddressesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
