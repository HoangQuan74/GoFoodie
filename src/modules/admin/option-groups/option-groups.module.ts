import { Module } from '@nestjs/common';
import { OptionGroupsService } from './option-groups.service';
import { OptionGroupsController } from './option-groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionGroupEntity } from 'src/database/entities/option-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OptionGroupEntity])],
  controllers: [OptionGroupsController],
  providers: [OptionGroupsService],
})
export class OptionGroupsModule {}
