import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { DriversService } from './drivers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverEntity } from 'src/database/entities/driver.entity';
import { DriversController } from './drivers.controller';
import { UniformsModule } from './uniforms/uniforms.module';
import { OnlineTrainingsModule } from './online-trainings/online-trainings.module';
import { BannersModule } from './banners/banners.module';
import { WorkingSessionsModule } from './working-sessions/working-sessions.module';

@Module({
  imports: [
    AuthModule,
    UniformsModule,
    TypeOrmModule.forFeature([DriverEntity]),
    RouterModule.register([
      { path: 'driver', module: AuthModule },
      { path: 'driver', module: OnlineTrainingsModule },
      { path: 'driver', module: BannersModule },
      { path: 'driver', module: WorkingSessionsModule },
    ]),
    OnlineTrainingsModule,
    BannersModule,
    WorkingSessionsModule,
  ],
  controllers: [DriversController],
  providers: [DriversService],
  exports: [DriversService],
})
export class DriversModule {}
