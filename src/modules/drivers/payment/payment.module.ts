import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverTransactionHistoryEntity } from 'src/database/entities/driver-transaction-history.entity';
import { DriversModule } from '../drivers/drivers.module';
import { PaymentModule as PaymentCommonModule } from 'src/modules/payment/payment.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DriverTransactionHistoryEntity]),
    DriversModule,
    forwardRef(() => PaymentCommonModule),
    EventsModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
