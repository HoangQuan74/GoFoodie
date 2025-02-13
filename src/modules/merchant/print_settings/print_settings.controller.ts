import { Body, Controller, Get, NotFoundException, Put, UseGuards } from '@nestjs/common';
import { PrintSettingsService } from './print_settings.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CurrentStore } from 'src/common/decorators/current-store.decorator';
import { EStorePrintType } from 'src/common/enums';
import { UpdatePrintSettingsDto } from './dto/update-print-settings.dto';

@Controller('print-settings')
@ApiTags('Merchant Print Settings')
@UseGuards(AuthGuard)
export class PrintSettingsController {
  constructor(private readonly printSettingsService: PrintSettingsService) {}

  @Get()
  async getPrintSettings(@CurrentStore() storeId: number) {
    let printSettings = await this.printSettingsService.findOne({ where: { storeId } });

    if (!printSettings) {
      const newPrintSettings = { storeId, printType: EStorePrintType.Customer, confirmTypes: [] };
      printSettings = await this.printSettingsService.save(newPrintSettings);
    }

    return printSettings;
  }

  @Put()
  async updatePrintSettings(@CurrentStore() storeId: number, @Body() body: UpdatePrintSettingsDto) {
    const printSettings = await this.printSettingsService.findOne({ where: { storeId } });

    if (!printSettings) throw new NotFoundException();
    return this.printSettingsService.save({ ...printSettings, ...body });
  }
}
