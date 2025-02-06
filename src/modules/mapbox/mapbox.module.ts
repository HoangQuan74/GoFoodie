import { Module } from '@nestjs/common';
import { MapboxService } from './mapbox.service';
import { MapboxController } from './mapbox.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistanceEntity } from 'src/database/entities/distance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DistanceEntity])],
  controllers: [MapboxController],
  providers: [MapboxService],
})
export class MapboxModule {}
