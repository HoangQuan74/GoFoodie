import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StoresService } from './stores.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators';
import * as moment from 'moment-timezone';
import { ProductEntity } from 'src/database/entities/product.entity';

@Controller('stores')
@ApiTags('Client Stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get('nearby')
  @Public()
  async findNearby() {
    const now = moment().tz('Asia/Ho_Chi_Minh');
    const dayOfWeek = now.day();
    const currentTime = now.hours() * 60 + now.minutes();
    console.log(dayOfWeek);

    const queryBuilder = this.storesService
      .createQueryBuilder('store')
      .innerJoin(
        'store.workingTimes',
        'workingTime',
        'workingTime.dayOfWeek = :dayOfWeek AND workingTime.openTime <= :currentTime AND workingTime.closeTime >= :currentTime',
      )
      .innerJoin('store.products', 'product', 'product.isAvailable = true')
      // .innerJoinAndSelect(
      //   (subQuery) => {
      //     return subQuery.from(ProductEntity, 'product');
      //   },
      //   'products',
      //   'products.store_id = store.id',
      // )
      .setParameters({ dayOfWeek, currentTime });

    const stores = await queryBuilder.getMany();
    console.log(stores.length);

    return stores;
    // return this.storesService.findNearby();
  }
}
