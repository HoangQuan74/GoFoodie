import { Module } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/database/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity])],
  controllers: [],
  providers: [FcmService],
  exports: [FcmService],
})
export class FcmModule {}
