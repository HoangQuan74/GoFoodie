import { forwardRef, Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverCardEntity } from 'src/database/entities/driver-card.entity';
import { DriversModule } from '../drivers.module';

@Module({
  imports: [TypeOrmModule.forFeature([DriverCardEntity]), forwardRef(() => DriversModule)],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
