import { Module } from '@nestjs/common';
import { ServiceGroupsService } from './service-groups.service';
import { ServiceGroupsController } from './service-groups.controller';
import { ServiceGroupEntity } from 'src/database/entities/service-group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceGroupEntity])],
  controllers: [ServiceGroupsController],
  providers: [ServiceGroupsService],
})
export class ServiceGroupsModule {}
