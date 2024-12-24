import { Module } from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { AdminsModule } from '../admins/admins.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerEntity } from 'src/database/entities/banner.entity';

@Module({
  imports: [AdminsModule, TypeOrmModule.forFeature([BannerEntity])],
  controllers: [BannersController],
  providers: [BannersService],
})
export class BannersModule {}
