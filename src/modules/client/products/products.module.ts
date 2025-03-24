import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/database/entities/product.entity';
import { ProductView } from 'src/database/views/product.view';
import { VouchersModule } from '../vouchers/vouchers.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ProductView]), forwardRef(() => VouchersModule)],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
