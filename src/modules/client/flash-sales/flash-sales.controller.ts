import { Controller } from '@nestjs/common';
import { FlashSalesService } from './flash-sales.service';

@Controller('flash-sales')
export class FlashSalesController {
  constructor(private readonly flashSalesService: FlashSalesService) {}
}
