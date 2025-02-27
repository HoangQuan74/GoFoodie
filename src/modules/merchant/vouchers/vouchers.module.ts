import { forwardRef, Module } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { VouchersController } from './vouchers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoucherEntity } from 'src/database/entities/voucher.entity';
import { MerchantModule } from '../merchants/merchant.module';

@Module({
  imports: [TypeOrmModule.forFeature([VoucherEntity]), forwardRef(() => MerchantModule)],
  controllers: [VouchersController],
  providers: [VouchersService],
})
export class VouchersModule {}
