import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, NotFoundException } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { QueryNoticeDto } from './dto/query-notice.dto';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { ENoticeStatus } from 'src/common/enums';
import { Brackets } from 'typeorm';

@Controller('notices')
@ApiTags('Notices')
@UseGuards(AuthGuard)
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Get('types')
  getTypes() {
    return this.noticesService.getTypes();
  }

  @Post()
  create(@Body() body: CreateNoticeDto, @CurrentUser() user: JwtPayload) {
    return this.noticesService.save({ ...body, createdById: user.id });
  }

  @Get()
  async find(@Query() query: QueryNoticeDto) {
    const { page, limit, type, appType, sendType, search, createdAtFrom, createdAtTo, status } = query;

    const queryBuilder = this.noticesService
      .createQueryBuilder('notice')
      .addSelect(['noticeType.name'])
      .leftJoin('notice.type', 'noticeType')
      .leftJoinAndSelect('notice.criteria', 'criteria')
      .orderBy('notice.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    type && queryBuilder.andWhere('notice.noticeTypeId = :type', { type });
    appType && queryBuilder.andWhere('notice.appType = :appType', { appType });
    sendType && queryBuilder.andWhere('notice.sendType = :sendType', { sendType });
    search && queryBuilder.andWhere('notice.title ILIKE :search', { search: `%${search}%` });
    createdAtFrom && queryBuilder.andWhere('notice.createdAt >= :createdAtFrom', { createdAtFrom });
    createdAtTo && queryBuilder.andWhere('notice.createdAt <= :createdAtTo', { createdAtTo });

    if (status) {
      switch (status) {
        case ENoticeStatus.NotStarted:
          queryBuilder.andWhere('notice.sendNow = false');
          queryBuilder.andWhere('notice.startDate > NOW()');
          break;
        case ENoticeStatus.InProgress:
          queryBuilder.andWhere('notice.sendNow = false');
          queryBuilder.andWhere('notice.startDate <= NOW()');
          queryBuilder.andWhere('notice.endTime IS NULL OR notice.endTime > NOW()');
          break;
        case ENoticeStatus.Ended:
          queryBuilder.andWhere(
            new Brackets((qb) => {
              qb.where('notice.sendNow = true')
                .orWhere('notice.endTime IS NOT NULL AND notice.endTime < NOW()')
                .orWhere('notice.endTime IS NULL AND notice.startDate < NOW()');
            }),
          );
          break;
      }
    }

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const item = await this.noticesService.findOne({ where: { id: +id }, relations: ['criteria'] });
    if (!item) throw new NotFoundException();

    return item;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateNoticeDto: UpdateNoticeDto) {
    const item = await this.noticesService.findOne({ where: { id: +id } });
    if (!item) throw new NotFoundException();

    return this.noticesService.save({ ...item, ...updateNoticeDto });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const item = await this.noticesService.findOne({ where: { id: +id } });
    if (!item) throw new NotFoundException();

    await this.noticesService.remove(item);
  }
}
