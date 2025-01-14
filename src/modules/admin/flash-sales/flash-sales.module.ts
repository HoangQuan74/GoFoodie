import { Module } from '@nestjs/common';
import { FlashSalesService } from './flash-sales.service';
import { FlashSalesController } from './flash-sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlashSaleEntity } from 'src/database/entities/flash-sale.entity';
import { FlashSaleTimeFrameEntity } from 'src/database/entities/flash-sale-time-frame.entity';
import { FlashSaleProductEntity } from 'src/database/entities/flash-sale-product.entity';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FlashSaleEntity, FlashSaleTimeFrameEntity, FlashSaleProductEntity]),
    AdminsModule,
  ],
  controllers: [FlashSalesController],
  providers: [FlashSalesService],
})
export class FlashSalesModule {}
