import { Module } from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { AdminsModule } from '../admins/admins.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerEntity } from 'src/database/entities/banner.entity';
import { BannerTypeEntity } from 'src/database/entities/banner-type.entity';
import { BannerPositionEntity } from 'src/database/entities/banner-position.entity';
import { BannerChangeTypeEntity } from 'src/database/entities/banner-change-type.entity';

@Module({
  imports: [
    AdminsModule,
    TypeOrmModule.forFeature([BannerEntity, BannerTypeEntity, BannerPositionEntity, BannerChangeTypeEntity]),
  ],
  controllers: [BannersController],
  providers: [BannersService],
})
export class BannersModule {}
