import { Controller, Get, Param } from '@nestjs/common';
import { BannersService } from './banners.service';
import { Public } from 'src/common/decorators';
import { Brackets } from 'typeorm';
import { EAppType } from 'src/common/enums/config.enum';

@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get(':position')
  @Public()
  async getBanner(@Param('position') position: string) {
    return this.bannersService
      .createQueryBuilder('banner')
      .where('banner.position = :position', { position })
      .andWhere('banner.appType = :appType', { appType: EAppType.AppClient })
      .andWhere('banner.startDate <= NOW()')
      .andWhere(
        new Brackets((qb) => {
          qb.where('banner.endDate >= NOW()').orWhere('banner.endDate IS NULL');
        }),
      )
      .getOne();
  }
}
