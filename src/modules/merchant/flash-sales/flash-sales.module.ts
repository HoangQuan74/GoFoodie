import { forwardRef, Module } from '@nestjs/common';
import { FlashSalesService } from './flash-sales.service';
import { FlashSalesController } from './flash-sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlashSaleEntity } from 'src/database/entities/flash-sale.entity';
import { FlashSaleTimeFrameEntity } from 'src/database/entities/flash-sale-time-frame.entity';
import { FlashSaleProductEntity } from 'src/database/entities/flash-sale-product.entity';
import { MerchantModule } from '../merchants/merchant.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FlashSaleEntity, FlashSaleTimeFrameEntity, FlashSaleProductEntity]),
    forwardRef(() => MerchantModule),
    ProductsModule,
  ],
  controllers: [FlashSalesController],
  providers: [FlashSalesService],
})
export class FlashSalesModule {}
