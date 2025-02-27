import { forwardRef, Module } from '@nestjs/common';
import { StoreAddressesService } from './store-addresses.service';
import { StoreAddressesController } from './store-addresses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreAddressEntity } from 'src/database/entities/store-address.entity';
import { MerchantModule } from '../merchants/merchant.module';
import { StoresModule } from '../stores/stores.module';

@Module({
  imports: [TypeOrmModule.forFeature([StoreAddressEntity]), forwardRef(() => MerchantModule), StoresModule],
  controllers: [StoreAddressesController],
  providers: [StoreAddressesService],
})
export class StoreAddressesModule {}
