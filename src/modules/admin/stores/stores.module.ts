import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from 'src/database/entities/store.entity';
import { WardsModule } from 'src/modules/wards/wards.module';
import { AdminsModule } from '../admins/admins.module';
import { StoreAddressEntity } from 'src/database/entities/store-address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreEntity, StoreAddressEntity]), WardsModule, AdminsModule],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService],
})
export class StoresModule {}
