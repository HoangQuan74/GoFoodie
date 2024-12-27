import { Module } from '@nestjs/common';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import { AdminsModule } from '../admins/admins.module';
import { ProvincesModule } from 'src/modules/provinces/provinces.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppTypeEntity } from 'src/database/entities/app-type.entity';

@Module({
  imports: [AdminsModule, ProvincesModule, TypeOrmModule.forFeature([AppTypeEntity])],
  controllers: [OptionsController],
  providers: [OptionsService],
})
export class OptionsModule {}
