import { forwardRef, Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverCardEntity } from 'src/database/entities/driver-card.entity';
import { DriversModule } from '../drivers/drivers.module';
import { PaymentModule } from 'src/modules/payment/payment.module';

@Module({
  imports: [TypeOrmModule.forFeature([DriverCardEntity]), forwardRef(() => DriversModule), PaymentModule],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
