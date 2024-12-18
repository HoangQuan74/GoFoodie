import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { WardsModule } from 'src/modules/wards/wards.module';
import { MerchantsModule } from '../merchants/merchants.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from 'src/database/entities/store.entity';

@Module({
  imports: [WardsModule, MerchantsModule, TypeOrmModule.forFeature([StoreEntity])],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}
