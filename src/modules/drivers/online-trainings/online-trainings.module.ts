import { forwardRef, Module } from '@nestjs/common';
import { OnlineTrainingsService } from './online-trainings.service';
import { OnlineTrainingsController } from './online-trainings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnlineTrainingEntity } from 'src/database/entities/online-training.entity';
import { DriversModule } from '../drivers/drivers.module';

@Module({
  imports: [TypeOrmModule.forFeature([OnlineTrainingEntity]), forwardRef(() => DriversModule)],
  controllers: [OnlineTrainingsController],
  providers: [OnlineTrainingsService],
})
export class OnlineTrainingsModule {}
