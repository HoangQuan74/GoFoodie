import { Module } from '@nestjs/common';
import { CancelOrderReasonsService } from './cancel-order-reasons.service';
import { CancelOrderReasonsController } from './cancel-order-reasons.controller';

@Module({
  controllers: [CancelOrderReasonsController],
  providers: [CancelOrderReasonsService],
})
export class CancelOrderReasonsModule {}
