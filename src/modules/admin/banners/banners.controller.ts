import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Query, UseGuards } from '@nestjs/common';
import { BannersService } from './banners.service';
import { AuthGuard } from '../auth/auth.guard';
import { BANNER_TYPES, BANNER_DISPLAY_TYPES } from 'src/common/constants';
import { ApiTags } from '@nestjs/swagger';
import { CreateBannerDto } from './dto/create-banner.dto';
import { QueryBannerDto } from './dto/query-banner.dto';

@Controller('banners')
@ApiTags('Banners')
@UseGuards(AuthGuard)
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get('types')
  getTypes() {
    return BANNER_TYPES;
  }

  @Get('display-types')
  getDisplayTypes() {
    return BANNER_DISPLAY_TYPES;
  }

  @Post()
  create(@Body() createBannerDto: CreateBannerDto) {
    return this.bannersService.save(createBannerDto);
  }

  @Get()
  async find(@Query() query: QueryBannerDto) {
    const { limit, page, type, appType } = query;
    const { createdAtFrom, createdAtTo, startDateFrom, startDateTo, endDateFrom, endDateTo } = query;

    const queryBuilder = this.bannersService
      .createQueryBuilder('banner')
      .orderBy('banner.id', 'DESC')
      .take(limit)
      .skip((page - 1) * limit);

    type && queryBuilder.andWhere('banner.type = :type', { type });
    appType && queryBuilder.andWhere('banner.appType = :appType', { appType });
    createdAtFrom && queryBuilder.andWhere('banner.createdAt >= :createdAtFrom', { createdAtFrom });
    createdAtTo && queryBuilder.andWhere('banner.createdAt <= :createdAtTo', { createdAtTo });
    startDateFrom && queryBuilder.andWhere('banner.startDate >= :startDateFrom', { startDateFrom });
    startDateTo && queryBuilder.andWhere('banner.startDate <= :startDateTo', { startDateTo });
    endDateFrom && queryBuilder.andWhere('banner.endDate >= :endDateFrom', { endDateFrom });
    endDateTo && queryBuilder.andWhere('banner.endDate <= :endDateTo', { endDateTo });

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const banner = await this.bannersService.findOne({ where: { id }, relations: { images: true, criteria: true } });
    if (!banner) throw new NotFoundException();

    return banner;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto) {
  //   return this.bannersService.update(+id, updateBannerDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const banner = await this.bannersService.findOne({ where: { id }, relations: { images: true, criteria: true } });
    if (!banner) throw new NotFoundException();

    return this.bannersService.remove(banner);
  }
}
