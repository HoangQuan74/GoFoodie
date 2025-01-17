import { Module } from '@nestjs/common';
import { FcmService } from './fcm.service';

@Module({
  controllers: [],
  providers: [FcmService],
  exports: [FcmService],
})
export class FcmModule {}
