import { Controller, Get, NotFoundException, Param, Post, Query, UseGuards } from '@nestjs/common';
import { StoresService } from './stores.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as moment from 'moment-timezone';
import { EProductStatus, EStoreApprovalStatus, EStoreStatus } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';
import { TIMEZONE } from 'src/common/constants';
import { Brackets } from 'typeorm';
import { QueryStoresDto } from './dto/query-stores.dto';
import * as lodash from 'lodash';
import { ProductEntity } from 'src/database/entities/product.entity';
import { ProductCategoriesService } from '../product-categories/product-categories.service';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { AuthGuard } from '../auth/auth.guard';
import { StoreLikeEntity } from 'src/database/entities/store-like.entity';
import { ProductView } from 'src/database/views/product.view';

@Controller('stores')
@ApiTags('Client Stores')
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}

  @Get('nearby')
  async findNearby(@Query() query: PaginationQuery) {
    const { limit, page } = query;

    const now = moment().tz(TIMEZONE);
    const dayOfWeek = now.day();
    const currentTime = now.hours() * 60 + now.minutes();

    const queryBuilder = this.storesService
      .createQueryBuilder('store')
      .select([
        'store.id',
        'store.name',
        'store.specialDish',
        'store.streetName',
        'store.storeAvatarId',
        'store.storeCoverId',
      ])
      .innerJoin(
        'store.workingTimes',
        'workingTime',
        // 'workingTime.dayOfWeek = :dayOfWeek AND workingTime.openTime <= :currentTime AND workingTime.closeTime >= :currentTime',
      )
      .addSelect(['product.id', 'product.name', 'product.price', 'product.imageId'])
      .innerJoin(
        'store.products',
        'product',
        'product.status = :productStatus AND product.approvalStatus = :productApprovalStatus',
      )
      .leftJoin('product.productWorkingTimes', 'productWorkingTime', 'product.isNormalTime = false')
      .where('store.isPause = false')
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

  @Get('suggestions')
  @UseGuards(AuthGuard)
  async findSuggestions(@Query() query: PaginationQuery, @CurrentUser() user: JwtPayload) {
    const { limit, page } = query;

    const now = moment().tz(TIMEZONE);
    const dayOfWeek = now.day();
    const currentTime = now.hours() * 60 + now.minutes();

    const queryBuilder = this.storesService
      .createQueryBuilder('store')
      .select([
        'store.id',
        'store.name',
        'store.specialDish',
        'store.streetName',
        'store.storeAvatarId',
        'store.storeCoverId',
      ])
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
      .leftJoin('store.orders', 'order', 'order.clientId = :clientId', { clientId: user.id })
      .addSelect('CASE WHEN COUNT(order.id) > 0 THEN 1 ELSE 0 END', 'has_order')
      .leftJoin('store.likes', 'storeLike', 'storeLike.clientId = :clientId', { clientId: user.id })
      .addSelect('CASE WHEN storeLike.storeId IS NULL THEN 0 ELSE 1 END', 'has_like')
      .andWhere('store.isPause = false')
      .andWhere('store.status = :storeStatus')
      .andWhere('store.approvalStatus = :storeApprovalStatus')
      .setParameters({ dayOfWeek, currentTime })
      .setParameters({ storeStatus: EStoreStatus.Active, storeApprovalStatus: EStoreApprovalStatus.Approved })
      .setParameters({ productStatus: EProductStatus.Active, productApprovalStatus: EStoreApprovalStatus.Approved })
      .groupBy('store.id')
      .addGroupBy('product.id')
      .addGroupBy('storeLike.storeId')
      .orderBy('has_order', 'DESC', 'NULLS LAST')
      .addOrderBy('has_like', 'DESC', 'NULLS LAST')
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
              'product.status as "status"',
              'product.approvalStatus as "approvalStatus"',
            ])
            .where('product.status = :productStatus')
            .andWhere('product.approvalStatus = :productApprovalStatus');
          // .limit(10);

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
      .setParameters({ storeStatus: EStoreStatus.Active, storeApprovalStatus: EStoreApprovalStatus.Approved })
      .setParameters({ productStatus: EProductStatus.Active, productApprovalStatus: EStoreApprovalStatus.Approved })
      .limit(limit)
      .offset((page - 1) * limit);

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

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    const { id: userId } = user;

    const queryBuilder = this.storesService
      .createQueryBuilder('store')
      .select([
        'store.id as id',
        'store.name as name',
        'store.specialDish as "specialDish"',
        'store.streetName as "streetName"',
        'store.storeAvatarId as "storeAvatarId"',
        'store.storeCoverId as "storeCoverId"',
      ])
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(1)', 'likeCount')
          .from(StoreLikeEntity, 'like')
          .where('like.storeId = store.id')
          .andWhere('like.clientId = :userId')
          .setParameters({ userId });
      }, 'likeCount')
      .where('store.id = :id')
      .andWhere('store.status = :storeStatus')
      .andWhere('store.approvalStatus = :storeApprovalStatus')
      .setParameters({ id, storeStatus: EStoreStatus.Active, storeApprovalStatus: EStoreApprovalStatus.Approved });

    const store = await queryBuilder.getRawOne();
    if (!store) throw new NotFoundException();

    return store;
  }

  @Get(':id/product-categories')
  async findProductCategories(@Param('id') storeId: number) {
    const queryBuilder = this.productCategoriesService
      .createQueryBuilder('category')
      .select(['category.id as id', 'category.name as name', 'category.description as description'])
      .addSelect([
        'product.id as "productId"',
        'product.name as "productName"',
        'product.price as "productPrice"',
        'product.imageId as "productImageId"',
        'product.liked as "productLiked"',
        'product.sold as "productSold"',
        'product.status as "productStatus"',
        'product.approvalStatus as "productApprovalStatus"',
      ])
      .leftJoin('category.stores', 'store', 'store.id = :storeId')
      .where(
        new Brackets((qb) => {
          qb.where('category.storeId = :storeId');
          qb.orWhere('store.id = :storeId');
        }),
      )
      .leftJoin(ProductView, 'product', 'product.productCategoryId = category.id AND product.storeId = :storeId')
      .andWhere('product.status = :productStatus')
      .andWhere('product.approvalStatus = :productApprovalStatus')
      .setParameters({
        storeId,
        productStatus: EProductStatus.Active,
        productApprovalStatus: EStoreApprovalStatus.Approved,
      });

    const categories = await queryBuilder.getRawMany();
    const items = lodash.groupBy(categories, 'id');

    return Object.values(items).map((category: any[]) => {
      const [first] = category;
      return {
        id: first.id,
        name: first.name,
        description: first.description,
        products: category.map((item) => ({
          id: item.productId,
          name: item.productName,
          price: item.productPrice,
          imageId: item.productImageId,
          liked: parseInt(item.productLiked),
          sold: parseInt(item.productSold),
          status: item.productStatus,
          approvalStatus: item.productApprovalStatus,
        })),
      };
    });
  }

  @Get(':id/working-times')
  async findWorkingTimes(@Param('id') storeId: number) {
    const queryBuilder = this.storesService
      .createQueryBuilder('store')
      .select(['store.id'])
      .addSelect(['workingTime.dayOfWeek', 'workingTime.openTime', 'workingTime.closeTime'])
      .leftJoin('store.workingTimes', 'workingTime')
      .where('store.id = :storeId')
      .setParameters({ storeId });

    const store = await queryBuilder.getOne();
    if (!store) throw new NotFoundException();

    return store.workingTimes;
  }

  @Post(':id/like')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Like store' })
  async likeStore(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    return this.storesService.likeStore(id, user.id);
  }

  @Post(':id/unlike')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Unlike store' })
  async unlikeStore(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    return this.storesService.unlikeStore(id, user.id);
  }

  @Get(':storeId/reviews')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get store reviews' })
  async findReviews(@Param('storeId') storeId: number, @Query() query: PaginationQuery) {
    const { limit, page } = query;

    const queryBuilder = this.storesService
      .createReviewStoreQueryBuilder('review')
      .select(['review.id', 'review.rating', 'review.comment', 'review.createdAt'])
      .where('review.storeId = :storeId')
      .withDeleted()
      .addSelect(['client.id', 'client.name', 'client.avatarId'])
      .innerJoin('review.client', 'client')
      .addSelect(['file.id', 'file.mimeType', 'file.name'])
      .leftJoin('review.files', 'file')
      .addSelect(['template.id', 'template.name'])
      .leftJoin('review.templates', 'template')
      .setParameters({ storeId })
      .take(limit)
      .skip((page - 1) * limit);

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  @Get(':storeId/booking-time')
  @ApiOperation({ summary: 'Get booking time' })
  async findBookingTime(@Param('storeId') storeId: number) {
    const now = moment().tz(TIMEZONE);
    const currentDate = now.format('YYYY-MM-DD');
    const nowTemp = now.clone();
    let dayOfWeek = now.day();
    const currentTime = now.hours() * 60 + now.minutes();

    const queryBuilder = this.storesService
      .createQueryBuilder('store')
      .select(['store.id'])
      .addSelect(['workingTime.dayOfWeek', 'workingTime.openTime', 'workingTime.closeTime'])
      .innerJoin('store.workingTimes', 'workingTime')
      .addSelect(['closeTime.date', 'closeTime.startTime', 'closeTime.endTime'])
      .leftJoin('store.specialWorkingTimes', 'closeTime', 'closeTime.date >= CURRENT_DATE')
      .where('store.id = :storeId')
      .orderBy('workingTime.dayOfWeek', 'ASC')
      .addOrderBy('workingTime.openTime', 'ASC')
      .setParameters({ storeId, dayOfWeek, currentTime });

    const store = await queryBuilder.getOne();
    if (!store) return [];

    const workingTimes = store.workingTimes;

    const closeTimes = store.specialWorkingTimes;
    let count = 0;
    const result = [];

    while (count < 3) {
      const formattedDate = nowTemp.format('YYYY-MM-DD');
      let openSlots = workingTimes
        .filter((item) => item.dayOfWeek === nowTemp.day())
        .map((item) => {
          return { openTime: item.openTime, closeTime: item.closeTime };
        });

      if (openSlots.length > 0) {
        const offDay = closeTimes.find((item) => item.date === formattedDate);
        if (offDay) {
          const { startTime, endTime } = offDay;
          const newOpenSlots = [];

          for (const slot of openSlots) {
            if (slot.openTime >= endTime || slot.closeTime <= startTime) {
              newOpenSlots.push(slot);
            } else if (slot.openTime >= startTime && slot.closeTime <= endTime) {
              continue;
            } else if (slot.openTime < startTime && slot.closeTime > endTime) {
              newOpenSlots.push({ openTime: slot.openTime, closeTime: startTime });
              newOpenSlots.push({ openTime: endTime, closeTime: slot.closeTime });
            } else if (slot.openTime < startTime) {
              newOpenSlots.push({ openTime: slot.openTime, closeTime: startTime });
            } else if (slot.closeTime > endTime) {
              newOpenSlots.push({ openTime: endTime, closeTime: slot.closeTime });
            }
          }

          openSlots = newOpenSlots;
        }
      }

      if (openSlots.length > 0) {
        if (formattedDate === currentDate) {
          const newOpenSlots = openSlots.filter((slot) => slot.closeTime >= currentTime);
          if (newOpenSlots.length > 0) {
            result.push({ date: formattedDate, openSlots: newOpenSlots });
            count++;
          }
        } else {
          result.push({ date: formattedDate, openSlots });
          count++;
        }
      }

      nowTemp.add(1, 'days');
      dayOfWeek = (dayOfWeek + 1) % 7;
    }

    return result;
  }
}
