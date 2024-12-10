import { Module } from '@nestjs/common';
import { ServiceGroupsService } from './service-groups.service';
import { ServiceGroupsController } from './service-groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceGroupEntity } from 'src/database/entities/service-group.entity';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceGroupEntity]), AdminsModule],
  controllers: [ServiceGroupsController],
  providers: [ServiceGroupsService],
})
export class ServiceGroupsModule {}
