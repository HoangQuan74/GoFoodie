import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MerchantModule } from '../merchant.module';

@Module({
  imports: [forwardRef(() => MerchantModule)],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
