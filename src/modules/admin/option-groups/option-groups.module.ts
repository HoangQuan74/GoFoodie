import { Module } from '@nestjs/common';
import { OptionGroupsService } from './option-groups.service';
import { OptionGroupsController } from './option-groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionGroupEntity } from 'src/database/entities/option-group.entity';
import { ProductOptionGroupsModule } from 'src/modules/product-option-groups/product-option-groups.module';
import { OptionEntity } from 'src/database/entities/option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OptionGroupEntity, OptionEntity]), ProductOptionGroupsModule],
  controllers: [OptionGroupsController],
  providers: [OptionGroupsService],
  exports: [OptionGroupsService],
})
export class OptionGroupsModule {}
