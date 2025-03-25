import { Module } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { StaffsController } from './staffs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantOperationEntity } from 'src/database/entities/merchant-operation.entity';
import { MerchantModule } from '../merchants/merchant.module';
import { StoreStaffEntity } from 'src/database/entities/store-staff.entity';
import { MerchantRoleEntity } from 'src/database/entities/merchant-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MerchantOperationEntity, StoreStaffEntity, MerchantRoleEntity]), MerchantModule],
  controllers: [StaffsController],
  providers: [StaffsService],
})
export class StaffsModule {}
