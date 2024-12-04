import { Module } from '@nestjs/common';
import { ProductOptionGroupsService } from './product-option-groups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOptionGroupEntity } from 'src/database/entities/product-option-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOptionGroupEntity])],
  controllers: [],
  providers: [ProductOptionGroupsService],
  exports: [ProductOptionGroupsService],
})
export class ProductOptionGroupsModule {}
