import { Controller, Query } from '@nestjs/common';
import { BannersService } from './banners.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/common/decorators';
import { Get, Param } from '@nestjs/common';
import { Brackets } from 'typeorm';
import { EAppType } from 'src/common/enums/config.enum';

@Controller('banners')
@ApiTags('Banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get(':position')
  @ApiOperation({ summary: 'Lấy banner theo vị trí' })
  @Public()
  async getBanner(@Param('position') position: string) {
    return this.bannersService
      .createQueryBuilder('banner')
      .select(['banner.id', 'banner.name', 'banner.type', 'banner.displayType', 'file.description'])
      .where('banner.position = :position', { position })
      .andWhere('banner.appType = :appType', { appType: EAppType.AppDriver })
      .innerJoinAndSelect('banner.files', 'file', 'file.isActive = TRUE')
      .andWhere('banner.startDate <= NOW()')
      .andWhere(
        new Brackets((qb) => {
          qb.where('banner.endDate >= NOW()').orWhere('banner.endDate IS NULL');
        }),
      )
      .orderBy('file.sort', 'ASC')
      .getOne();
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách banner' })
  @Public()
  async find(@Query('page') page: string) {
    return this.bannersService
      .createQueryBuilder('banner')
      .select(['banner.id', 'banner.name', 'banner.type', 'banner.displayType', 'file.description'])
      .where('banner.position ILIKE :page', { page: `%${page}%` })
      .andWhere('banner.appType = :appType', { appType: EAppType.AppDriver })
      .innerJoinAndSelect('banner.files', 'file', 'file.isActive = TRUE')
      .andWhere('banner.startDate <= NOW()')
      .andWhere(
        new Brackets((qb) => {
          qb.where('banner.endDate >= NOW()').orWhere('banner.endDate IS NULL');
        }),
      )
      .orderBy('file.sort', 'ASC')
      .getMany();
  }
}
