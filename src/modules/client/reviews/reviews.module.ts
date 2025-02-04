import { forwardRef, Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientReviewDriverEntity } from 'src/database/entities/client-review-driver.entity';
import { ClientReviewStoreEntity } from 'src/database/entities/client-review-store.entity';
import { OrderEntity } from 'src/database/entities/order.entity';
import { ClientModule } from '../client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientReviewDriverEntity, ClientReviewStoreEntity, OrderEntity]),
    forwardRef(() => ClientModule),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
