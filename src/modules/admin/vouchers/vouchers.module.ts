import { Module } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { VouchersController } from './vouchers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoucherEntity } from 'src/database/entities/voucher.entity';
import { VoucherTypeEntity } from 'src/database/entities/voucher-type.entity';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [TypeOrmModule.forFeature([VoucherEntity, VoucherTypeEntity]), AdminsModule],
  controllers: [VouchersController],
  providers: [VouchersService],
})
export class VouchersModule {}
