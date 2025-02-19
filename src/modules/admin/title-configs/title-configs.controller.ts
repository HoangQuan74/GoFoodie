import { Controller, Get, Body, UseGuards, Put } from '@nestjs/common';
import { DriverTitleConfigsService } from './title-configs.service';
import { AuthGuard } from '../auth/auth.guard';
import { UpsertDriverTitleConfigDto } from './dto/upsert-title-config.dto';
import { ApiTags } from '@nestjs/swagger';
import { EAppType } from 'src/common/enums/config.enum';

@Controller('title-configs')
@ApiTags('Title Configs')
@UseGuards(AuthGuard)
export class DriverTitleConfigsController {
  constructor(private readonly driverTitleConfigsService: DriverTitleConfigsService) {}

  @Put('driver')
  async create(@Body() body: UpsertDriverTitleConfigDto) {
    return this.driverTitleConfigsService.create({ ...body, type: EAppType.AppDriver });
  }

  @Get('driver')
  find() {
    return this.driverTitleConfigsService.findOne({
      where: { type: EAppType.AppDriver },
      relations: ['driverTitles', 'driverTitles.policies'],
    });
  }

  @Put('store')
  async store(@Body() body: UpsertDriverTitleConfigDto) {
    return this.driverTitleConfigsService.create({ ...body, type: EAppType.AppMerchant });
  }

  @Get('store')
  findStore() {
    return this.driverTitleConfigsService.findOne({
      where: { type: EAppType.AppMerchant },
      relations: ['driverTitles', 'driverTitles.policies'],
    });
  }
}
