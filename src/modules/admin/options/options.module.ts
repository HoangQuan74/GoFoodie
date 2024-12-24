import { Module } from '@nestjs/common';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import { AdminsModule } from '../admins/admins.module';
import { ProvincesModule } from 'src/modules/provinces/provinces.module';

@Module({
  imports: [AdminsModule, ProvincesModule],
  controllers: [OptionsController],
  providers: [OptionsService],
})
export class OptionsModule {}
