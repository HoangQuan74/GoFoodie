import { forwardRef, Module } from '@nestjs/common';
import { WorkingSessionsService } from './working-sessions.service';
import { WorkingSessionsController } from './working-sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverWorkingSessionEntity } from 'src/database/entities/working-sessions.entity';
import { DriversModule } from '../drivers/drivers.module';

@Module({
  imports: [TypeOrmModule.forFeature([DriverWorkingSessionEntity]), forwardRef(() => DriversModule)],
  controllers: [WorkingSessionsController],
  providers: [WorkingSessionsService],
})
export class WorkingSessionsModule {}
