import { Module } from '@nestjs/common';
import { CancelOrderReasonsService } from './cancel-order-reasons.service';
import { CancelOrderReasonsController } from './cancel-order-reasons.controller';
import { CancelOrderReasonEntity } from 'src/database/entities/cancel-order-reason.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CancelOrderReasonEntity])],
  controllers: [CancelOrderReasonsController],
  providers: [CancelOrderReasonsService],
})
export class CancelOrderReasonsModule {}
