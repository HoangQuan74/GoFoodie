import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverTransactionHistoryEntity } from 'src/database/entities/driver-transaction-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DriverTransactionHistoryEntity])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
