import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { DriversService } from './drivers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverEntity } from 'src/database/entities/driver.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([DriverEntity]),
    RouterModule.register([{ path: 'driver', module: AuthModule }]),
  ],
  controllers: [],
  providers: [DriversService],
  exports: [DriversService],
})
export class DriversModule {}
