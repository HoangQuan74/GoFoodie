import { forwardRef, Module } from '@nestjs/common';
import { OptionGroupsService } from './option-groups.service';
import { OptionGroupsController } from './option-groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionGroupEntity } from 'src/database/entities/option-group.entity';
import { OptionEntity } from 'src/database/entities/option.entity';
import { MerchantModule } from '../merchant.module';

@Module({
  imports: [TypeOrmModule.forFeature([OptionGroupEntity, OptionEntity]), forwardRef(() => MerchantModule)],
  controllers: [OptionGroupsController],
  providers: [OptionGroupsService],
  exports: [OptionGroupsService],
})
export class OptionGroupsModule {}
