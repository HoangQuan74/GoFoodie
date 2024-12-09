import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverEntity } from 'src/database/entities/driver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DriverEntity])],
  controllers: [DriversController],
  providers: [DriversService],
})
export class DriversModule {}
