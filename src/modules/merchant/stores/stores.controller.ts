import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards, Query } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { TIMEZONE } from 'src/common/constants';
import * as moment from 'moment-timezone';
import { DataSource, FindOptionsWhere, Like, Not } from 'typeorm';
import { WardsService } from 'src/modules/wards/wards.service';
import { StoreEntity } from 'src/database/entities/store.entity';
import { EStoreApprovalStatus } from 'src/common/enums';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { AuthGuard } from '../auth/auth.guard';
import { PaginationQuery } from 'src/common/query';
import { ApiTags } from '@nestjs/swagger';
import { ServiceTypeEntity } from 'src/database/entities/service-type.entity';
import { ProvinceEntity } from 'src/database/entities/province.entity';

@Controller('stores')
@ApiTags('Merchant Stores')
@UseGuards(AuthGuard)
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
    private readonly dataSource: DataSource,
    private readonly wardsService: WardsService,
  ) {}

  @Post()
  create(@Body() createStoreDto: CreateStoreDto, @CurrentUser() user: JwtPayload) {
    const { wardId, isDraft } = createStoreDto;

    return this.dataSource.transaction(async (manager) => {
      const newStore = new StoreEntity();
      newStore.merchantId = user.id;
      Object.assign(newStore, createStoreDto);
      newStore.approvalStatus = isDraft ? EStoreApprovalStatus.Draft : EStoreApprovalStatus.Pending;

      if (wardId) {
        const { districtId, provinceId } = await this.wardsService.getProvinceIdAndDistrictId(wardId);
        if (!districtId || !provinceId) throw new NotFoundException();
        newStore.districtId = districtId;
        newStore.provinceId = provinceId;
      }

      return manager.save(newStore);
    });
  }

  @Get()
  async find(@Query() query: PaginationQuery, @CurrentUser() user: JwtPayload) {
    const { page, limit } = query;

    const where: FindOptionsWhere<StoreEntity>[] = [{ merchantId: user.id }];
    user.storeId && where.push({ id: user.storeId });

    const options = {
      // select: ['id', 'name', 'storeCode', 'approvalStatus', 'createdAt', 'updatedAt'],
      skip: (page - 1) * limit,
      take: limit,
      where,
    };
    const [items, total] = await this.storesService.findAndCount(options);

    return { items, total };
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.storesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
  //   return this.storesService.update(+id, updateStoreDto);
  // }

  @Delete(':id')
  async delete(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    const options = {
      where: { id, merchantId: user.id, approvalStatus: Not(EStoreApprovalStatus.Approved) },
      relations: { workingTimes: true, banks: true, representative: true },
    };
    const store = await this.storesService.findOne(options);
    if (!store) throw new NotFoundException();

    return this.storesService.remove(store);
  }
}
