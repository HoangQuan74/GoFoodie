import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { DriversService } from './drivers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverEntity } from 'src/database/entities/driver.entity';
import { DriversController } from './drivers.controller';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([DriverEntity]),
    RouterModule.register([{ path: 'driver', module: AuthModule }]),
  ],
  controllers: [DriversController],
  providers: [DriversService],
  exports: [DriversService],
})
export class DriversModule {}
