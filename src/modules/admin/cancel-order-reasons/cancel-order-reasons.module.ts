import { Module } from '@nestjs/common';
import { CancelOrderReasonsService } from './cancel-order-reasons.service';
import { CancelOrderReasonsController } from './cancel-order-reasons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CancelOrderReasonEntity } from 'src/database/entities/cancel-order-reason.entity';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [TypeOrmModule.forFeature([CancelOrderReasonEntity]), AdminsModule],
  controllers: [CancelOrderReasonsController],
  providers: [CancelOrderReasonsService],
})
export class CancelOrderReasonsModule {}
