import { Test, TestingModule } from '@nestjs/testing';
import { PrintSettingsController } from './print_settings.controller';
import { PrintSettingsService } from './print_settings.service';

describe('PrintSettingsController', () => {
  let controller: PrintSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrintSettingsController],
      providers: [PrintSettingsService],
    }).compile();

    controller = module.get<PrintSettingsController>(PrintSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
