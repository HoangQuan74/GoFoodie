import { Test, TestingModule } from '@nestjs/testing';
import { PrintSettingsService } from './print_settings.service';

describe('PrintSettingsService', () => {
  let service: PrintSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrintSettingsService],
    }).compile();

    service = module.get<PrintSettingsService>(PrintSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
