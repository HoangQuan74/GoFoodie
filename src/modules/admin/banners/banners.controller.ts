import { BannerEntity } from 'src/database/entities/banner.entity';
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BannersService } from './banners.service';
import { AuthGuard } from '../auth/auth.guard';
import { APP_TYPES, BANNER_DISPLAY_TYPES, EXCEPTIONS } from 'src/common/constants';
import { ApiTags } from '@nestjs/swagger';
import { CreateBannerDto } from './dto/create-banner.dto';
import { QueryBannerDto } from './dto/query-banner.dto';
import { Brackets, DataSource } from 'typeorm';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { JwtPayload } from 'src/common/interfaces';
import { CurrentUser } from 'src/common/decorators';
import { EBannerStatus } from 'src/common/enums';
import { EAppType } from 'src/common/enums/config.enum';

@Controller('banners')
@ApiTags('Banners')
@UseGuards(AuthGuard)
export class BannersController {
  constructor(
    private readonly bannersService: BannersService,
    private readonly dataSource: DataSource,
  ) {}

  @Get('types')
  getTypes() {
    return this.bannersService.getTypes();
  }

  @Get('change-types')
  getChangeTypes() {
    return this.bannersService.getChangeTypes();
  }

  @Get('display-types')
  getDisplayTypes() {
    return BANNER_DISPLAY_TYPES;
  }

  @Get('positions')
  async getPositions(@Query('appType') appType: EAppType, @Query('type') type: string) {
    return this.bannersService.getPositions(appType, type);
  }

  @Post()
  create(@Body() createBannerDto: CreateBannerDto, @CurrentUser() user: JwtPayload) {
    return this.dataSource.transaction(async (manager) => {
      const lastBanner = await manager.findOne(BannerEntity, { where: {}, order: { id: 'DESC' }, withDeleted: true });
      const lastBannerId = lastBanner ? lastBanner.id : 0;
      const { startDate, endDate, appType, type, position } = createBannerDto;

      const existedBannerBuilder = await manager
        .createQueryBuilder(BannerEntity, 'banner')
        .where('banner.appType = :appType', { appType })
        .andWhere('banner.type = :type', { type })
        .andWhere('banner.position = :position', { position })
        .andWhere(
          new Brackets((qb) => {
            qb.where('banner.endDate >= :startDate', { startDate });
            qb.orWhere('banner.endDate IS NULL');
          }),
        );
      endDate && existedBannerBuilder.andWhere('banner.startDate <= :endDate', { endDate });

      const existedBanner = await existedBannerBuilder.getOne();
      if (existedBanner) throw new ConflictException(EXCEPTIONS.BANNER_EXISTED);

      const code = `ID${(lastBannerId + 1).toString().padStart(6, '0')}`;
      return manager.save(BannerEntity, { ...createBannerDto, code, createdById: user.id });
    });
  }

  @Get()
  async find(@Query() query: QueryBannerDto) {
    const { limit, page, type, appType, search, status } = query;
    const { createdAtFrom, createdAtTo, startDateFrom, startDateTo, endDateFrom, endDateTo } = query;

    const queryBuilder = this.bannersService
      .createQueryBuilder('banner')
      .addSelect(['createdBy.id', 'createdBy.name'])
      .loadRelationCountAndMap('banner.countActiveBanner', 'banner.files', 'file', (qb) =>
        qb.andWhere('file.isActive = TRUE'),
      )
      .leftJoin('banner.createdBy', 'createdBy')
      .leftJoin('banner.files', 'file', 'file.isActive = TRUE')
      .leftJoinAndSelect('banner.positionEntity', 'positionEntity')
      .leftJoinAndSelect('banner.typeEntity', 'typeEntity')
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

    if (search) {
      const searchLower = search.toLowerCase();
      const appTypes = APP_TYPES.filter((app) => app.label.toLowerCase().includes(searchLower));

      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('banner.name ILIKE :search', { search: `%${search}%` });
          qb.orWhere('banner.code ILIKE :search', { search: `%${search}%` });
          qb.orWhere('positionEntity.label ILIKE :search', { search: `%${search}%` });

          if (appTypes.length) {
            const appTypeIds = appTypes.map((app) => app.value);
            qb.orWhere('banner.appType IN (:...appTypeIds)', { appTypeIds });
          }
        }),
      );
    }

    switch (status) {
      case EBannerStatus.NotStarted:
        queryBuilder.andWhere('banner.startDate > NOW() AND file.id IS NOT NULL');
        break;
      case EBannerStatus.InProgress:
        queryBuilder.andWhere(
          'banner.startDate <= NOW() AND (banner.endDate > NOW() OR banner.endDate IS NULL) AND file.id IS NOT NULL',
        );
        break;
      case EBannerStatus.Ended:
        queryBuilder.andWhere('banner.endDate <= NOW() OR file.id IS NULL');
        break;
    }

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const banner = await this.bannersService.findOne({ where: { id }, relations: { files: true, criteria: true } });
    if (!banner) throw new NotFoundException();

    return banner;
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateBannerDto: UpdateBannerDto) {
    const banner = await this.bannersService.findOne({ where: { id } });
    if (!banner) throw new NotFoundException();

    const { startDate, endDate, appType, type, position } = updateBannerDto;
    const existedBannerBuilder = this.bannersService
      .createQueryBuilder('banner')
      .where('banner.id != :id', { id })
      .andWhere('banner.appType = :appType', { appType })
      .andWhere('banner.type = :type', { type })
      .andWhere('banner.position = :position', { position })
      .andWhere(
        new Brackets((qb) => {
          qb.where('banner.endDate >= :startDate', { startDate });
          qb.orWhere('banner.endDate IS NULL');
        }),
      );
    endDate && existedBannerBuilder.andWhere('banner.startDate <= :endDate', { endDate });
    const existedBanner = await existedBannerBuilder.getOne();
    if (existedBanner) throw new ConflictException(EXCEPTIONS.BANNER_EXISTED);

    Object.assign(banner, updateBannerDto);
    return this.bannersService.save(banner);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const banner = await this.bannersService.findOne({ where: { id }, relations: { files: true, criteria: true } });
    if (!banner) throw new NotFoundException();

    return this.bannersService.remove(banner);
  }
}
