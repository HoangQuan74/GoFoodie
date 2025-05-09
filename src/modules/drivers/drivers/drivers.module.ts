import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverEntity } from 'src/database/entities/driver.entity';
import { DriversController } from './drivers.controller';
import { UniformsModule } from '../uniforms/uniforms.module';

@Module({
  imports: [TypeOrmModule.forFeature([DriverEntity]), UniformsModule],
  controllers: [DriversController],
  providers: [DriversService],
  exports: [DriversService],
})
export class DriversModule {}
