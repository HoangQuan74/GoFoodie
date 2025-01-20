import { Controller, Get } from '@nestjs/common';
import { CancelOrderReasonsService } from './cancel-order-reasons.service';
import { EAppType } from 'src/common/enums/config.enum';

@Controller('cancel-order-reasons')
export class CancelOrderReasonsController {
  constructor(private readonly cancelOrderReasonsService: CancelOrderReasonsService) {}

  @Get()
  async find() {
    return this.cancelOrderReasonsService.find({ where: { status: true, appTypes: { value: EAppType.AppMerchant } } });
  }
}
