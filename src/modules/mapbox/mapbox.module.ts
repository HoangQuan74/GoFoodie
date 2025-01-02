import { Module } from '@nestjs/common';
import { MapboxService } from './mapbox.service';
import { MapboxController } from './mapbox.controller';

@Module({
  controllers: [MapboxController],
  providers: [MapboxService],
})
export class MapboxModule {}
