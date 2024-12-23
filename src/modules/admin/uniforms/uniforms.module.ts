import { Module } from '@nestjs/common';
import { UniformsService } from './uniforms.service';
import { DriverUniformsController } from './uniforms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniformEntity } from 'src/database/entities/uniform.entity';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [TypeOrmModule.forFeature([UniformEntity]), AdminsModule],
  controllers: [DriverUniformsController],
  providers: [UniformsService],
  exports: [UniformsService],
})
export class UniformsModule {}
