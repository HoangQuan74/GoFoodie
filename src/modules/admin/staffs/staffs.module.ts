import { Module } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { StaffsController } from './staffs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantEntity } from 'src/database/entities/merchant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MerchantEntity])],
  controllers: [StaffsController],
  providers: [StaffsService],
})
export class StaffsModule {}
