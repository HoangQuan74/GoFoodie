import { forwardRef, Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientReviewDriverEntity } from 'src/database/entities/client-review-driver.entity';
import { ClientReviewStoreEntity } from 'src/database/entities/client-review-store.entity';
import { OrderEntity } from 'src/database/entities/order.entity';
import { ClientModule } from '../clients/client.module';
import { ChallengeEntity } from 'src/database/entities/challenge.entity';
import { CoinsModule } from '../coins/coins.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientReviewDriverEntity, ClientReviewStoreEntity, OrderEntity, ChallengeEntity]),
    forwardRef(() => ClientModule),
    forwardRef(() => CoinsModule),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
