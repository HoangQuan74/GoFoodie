import { forwardRef, Module } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { VouchersController } from './vouchers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoucherEntity } from 'src/database/entities/voucher.entity';
import { CartsModule } from '../carts/carts.module';

@Module({
  imports: [TypeOrmModule.forFeature([VoucherEntity]), CartsModule],
  controllers: [VouchersController],
  providers: [VouchersService],
  exports: [VouchersService],
})
export class VouchersModule {}
