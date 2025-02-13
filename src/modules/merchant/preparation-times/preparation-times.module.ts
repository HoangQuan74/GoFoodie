import { forwardRef, Module } from '@nestjs/common';
import { PreparationTimesService } from './preparation-times.service';
import { PreparationTimesController } from './preparation-times.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresModule } from '../stores/stores.module';
import { StorePreparationTimeEntity } from 'src/database/entities/store-preparation-time.entity';
import { MerchantModule } from '../merchant.module';

@Module({
  imports: [TypeOrmModule.forFeature([StorePreparationTimeEntity]), StoresModule, forwardRef(() => MerchantModule)],
  controllers: [PreparationTimesController],
  providers: [PreparationTimesService],
})
export class PreparationTimesModule {}
