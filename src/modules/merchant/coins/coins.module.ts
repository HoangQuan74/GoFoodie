import { forwardRef, Module } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { CoinsController } from './coins.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreCoinHistoryEntity } from 'src/database/entities/store-coin-history.entity';
import { StoreCoinEventEntity } from 'src/database/entities/store-coin-event.entity';
import { MerchantModule } from '../merchants/merchant.module';

@Module({
  imports: [TypeOrmModule.forFeature([StoreCoinHistoryEntity, StoreCoinEventEntity]), forwardRef(() => MerchantModule)],
  controllers: [CoinsController],
  providers: [CoinsService],
  exports: [CoinsService],
})
export class CoinsModule {}
