import { Controller, Get, Query } from '@nestjs/common';
import { StoresService } from './stores.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators';
import * as moment from 'moment-timezone';
import { EProductStatus, EStoreApprovalStatus, EStoreStatus } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';
import { TIMEZONE } from 'src/common/constants';
import { Brackets } from 'typeorm';

@Controller('stores')
@ApiTags('Client Stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get('nearby')
  @Public()
  async findNearby(@Query() query: PaginationQuery) {
    const { limit, page } = query;

    const now = moment().tz(TIMEZONE);
    const dayOfWeek = now.day();
    const currentTime = now.hours() * 60 + now.minutes();

    const queryBuilder = this.storesService
      .createQueryBuilder('store')
      .select(['store.id', 'store.name', 'store.specialDish', 'store.streetName', 'store.storeAvatarId'])
      .innerJoin(
        'store.workingTimes',
        'workingTime',
        'workingTime.dayOfWeek = :dayOfWeek AND workingTime.openTime <= :currentTime AND workingTime.closeTime >= :currentTime',
      )
      .addSelect(['product.id', 'product.name', 'product.price', 'product.imageId'])
      .innerJoin(
        'store.products',
        'product',
        'product.status = :productStatus AND product.approvalStatus = :productApprovalStatus',
      )
      .leftJoin('product.productWorkingTimes', 'productWorkingTime', 'product.isNormalTime = false')
      .where(
        new Brackets((qb) => {
          qb.where('product.isNormalTime = true');
          qb.orWhere(
            new Brackets((qb) => {
              qb.where('productWorkingTime.dayOfWeek = :dayOfWeek', { dayOfWeek });
              qb.andWhere('productWorkingTime.openTime <= :currentTime', { currentTime });
              qb.andWhere('productWorkingTime.closeTime >= :currentTime', { currentTime });
            }),
          );
        }),
      )
      .andWhere('store.isPause = false')
      .andWhere('store.status = :storeStatus')
      .andWhere('store.approvalStatus = :storeApprovalStatus')
      .setParameters({ dayOfWeek, currentTime })
      .setParameters({ storeStatus: EStoreStatus.Active, storeApprovalStatus: EStoreApprovalStatus.Approved })
      .setParameters({ productStatus: EProductStatus.Active, productApprovalStatus: EStoreApprovalStatus.Approved })
      .take(limit)
      .skip((page - 1) * limit);

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }
}
