import { forwardRef, Module } from '@nestjs/common';
import { PrintSettingsService } from './print_settings.service';
import { PrintSettingsController } from './print_settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorePrintSettingEntity } from 'src/database/entities/store-print-setting.entity';
import { MerchantModule } from '../merchants/merchant.module';

@Module({
  imports: [TypeOrmModule.forFeature([StorePrintSettingEntity]), forwardRef(() => MerchantModule)],
  controllers: [PrintSettingsController],
  providers: [PrintSettingsService],
})
export class PrintSettingsModule {}
