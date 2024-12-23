import { Module } from '@nestjs/common';
import { DriverUniformsService } from './driver-uniforms.service';
import { DriverUniformsController } from './driver-uniforms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniformEntity } from 'src/database/entities/uniform.entity';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [TypeOrmModule.forFeature([UniformEntity]), AdminsModule],
  controllers: [DriverUniformsController],
  providers: [DriverUniformsService],
})
export class DriverUniformsModule {}
