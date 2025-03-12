import { forwardRef, Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { WardsModule } from 'src/modules/wards/wards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from 'src/database/entities/store.entity';
import { MerchantModule } from '../merchants/merchant.module';
import { NotificationsModule } from 'src/modules/admin/notifications/notifications.module';
import { EventsModule } from 'src/events/events.module';
import { FirebaseModule } from 'src/modules/firebase/firebase.module';

@Module({
  imports: [
    WardsModule,
    TypeOrmModule.forFeature([StoreEntity]),
    forwardRef(() => MerchantModule),
    NotificationsModule,
    FirebaseModule,
    EventsModule,
  ],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService],
})
export class StoresModule {}
