import { Module } from '@nestjs/common';
import { OptionGroupsService } from './option-groups.service';
import { OptionGroupsController } from './option-groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionGroupEntity } from 'src/database/entities/option-group.entity';
import { ProductOptionGroupsModule } from 'src/modules/product-option-groups/product-option-groups.module';

@Module({
  imports: [TypeOrmModule.forFeature([OptionGroupEntity]), ProductOptionGroupsModule],
  controllers: [OptionGroupsController],
  providers: [OptionGroupsService],
})
export class OptionGroupsModule {}
