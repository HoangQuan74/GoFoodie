import { Controller, Get, Query } from '@nestjs/common';
import { StoresService } from './stores.service';
import { ApiTags } from '@nestjs/swagger';
import * as moment from 'moment-timezone';
import { EProductStatus, EStoreApprovalStatus, EStoreStatus } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';
import { TIMEZONE } from 'src/common/constants';
import { Brackets } from 'typeorm';
import { QueryStoresDto } from './dto/query-stores.dto';
import * as lodash from 'lodash';
import { ProductEntity } from 'src/database/entities/product.entity';

@Controller('stores')
@ApiTags('Client Stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get('nearby')
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

  @Get()
  async findAll(@Query() query: QueryStoresDto) {
    const { limit, page, productCategoryCode } = query;

    const now = moment().tz(TIMEZONE);
    const dayOfWeek = now.day();
    const currentTime = now.hours() * 60 + now.minutes();

    const queryBuilder = this.storesService
      .createQueryBuilder('store')
      .select([
        'store.id as "storeId"',
        'store.name as "storeName"',
        'store.specialDish as "storeSpecialDish"',
        'store.streetName as "storeStreetName"',
        'store.storeAvatarId as "storeStoreAvatarId"',
      ])
      .innerJoinAndSelect(
        (subQuery) => {
          const subQueryBuilder = subQuery
            .from(ProductEntity, 'product')
            .select([
              'product.id as id',
              'product.name as name',
              'product.price as price',
              'product.imageId as "imageId"',
              'product.storeId as "storeId"',
            ])
            .leftJoin('product.productWorkingTimes', 'productWorkingTime', 'product.isNormalTime = false')
            .where('product.status = :productStatus')
            .andWhere('product.approvalStatus = :productApprovalStatus')
            .andWhere(
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
            .limit(10);

          if (productCategoryCode) {
            subQueryBuilder.innerJoin('product.productCategory', 'category', 'category.code = :productCategoryCode');
            subQueryBuilder.setParameters({ productCategoryCode });
          }

          return subQueryBuilder;
        },
        'product',
        'product."storeId" = store.id',
      )
      .andWhere('store.isPause = false')
      .andWhere('store.status = :storeStatus')
      .andWhere('store.approvalStatus = :storeApprovalStatus')
      .setParameters({ dayOfWeek, currentTime })
      .setParameters({ storeStatus: EStoreStatus.Active, storeApprovalStatus: EStoreApprovalStatus.Approved })
      .setParameters({ productStatus: EProductStatus.Active, productApprovalStatus: EStoreApprovalStatus.Approved })
      .take(limit)
      .skip((page - 1) * limit);

    const rawItems = await queryBuilder.getRawMany();
    const total = await queryBuilder.getCount();
    const stores = lodash.groupBy(rawItems, 'storeId') as Record<string, any[]>;

    const items = Object.values(stores).map((store) => {
      const [first] = store;
      return {
        id: first.storeId,
        name: first.storeName,
        specialDish: first.storeSpecialDish,
        streetName: first.storeStreetName,
        storeAvatarId: first.storeStoreAvatarId,
        rating: 4.5,
        products: store.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          imageId: item.imageId,
          storeId: item.storeId,
        })),
      };
    });

    return { items, total };
  }
}
