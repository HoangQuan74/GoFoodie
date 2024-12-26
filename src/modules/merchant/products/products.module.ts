import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MerchantModule } from '../merchant.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/database/entities/product.entity';
import { OptionGroupsModule } from '../option-groups/option-groups.module';

@Module({
  imports: [forwardRef(() => MerchantModule), TypeOrmModule.forFeature([ProductEntity]), OptionGroupsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
