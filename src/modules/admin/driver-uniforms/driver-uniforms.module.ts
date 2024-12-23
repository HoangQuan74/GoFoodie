import { Module } from '@nestjs/common';
import { DriverUniformsService } from './driver-uniforms.service';
import { DriverUniformsController } from './driver-uniforms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverUniformEntity } from 'src/database/entities/driver-uniform.entity';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [TypeOrmModule.forFeature([DriverUniformEntity]), AdminsModule],
  controllers: [DriverUniformsController],
  providers: [DriverUniformsService],
})
export class DriverUniformsModule {}
