import { forwardRef, Module } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { CoinsController } from './coins.controller';
import { ClientCoinHistoryEntity } from 'src/database/entities/client-coin-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from '../clients/client.module';
import { OrdersModule } from '../order/order.module';
import { ReviewsModule } from '../reviews/reviews.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientCoinHistoryEntity]),
    forwardRef(() => ClientModule),
    OrdersModule,
    forwardRef(() => ReviewsModule),
  ],
  controllers: [CoinsController],
  providers: [CoinsService],
  exports: [CoinsService],
})
export class CoinsModule {}
