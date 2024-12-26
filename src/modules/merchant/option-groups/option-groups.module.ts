import { Module } from '@nestjs/common';
import { OptionGroupsService } from './option-groups.service';
import { OptionGroupsController } from './option-groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionGroupEntity } from 'src/database/entities/option-group.entity';
import { OptionEntity } from 'src/database/entities/option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OptionGroupEntity, OptionEntity])],
  controllers: [OptionGroupsController],
  providers: [OptionGroupsService],
  exports: [OptionGroupsService],
})
export class OptionGroupsModule {}
