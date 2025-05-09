import { normalizeText } from './../../../utils/bcrypt';
import { Controller, Get, NotFoundException, Param, Post, Query, UseGuards } from '@nestjs/common';
import { StoresService } from './stores.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as moment from 'moment-timezone';
import { EProductStatus, EStoreApprovalStatus, EStoreStatus } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';
import { DRIVER_SPEED, TIMEZONE } from 'src/common/constants';
import { Brackets } from 'typeorm';
import { QueryStoresDto } from './dto/query-stores.dto';
import * as lodash from 'lodash';
import { ProductCategoriesService } from '../product-categories/product-categories.service';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { AuthGuard } from '../auth/auth.guard';
import { StoreLikeEntity } from 'src/database/entities/store-like.entity';
import { ProductView } from 'src/database/views/product.view';
import { VouchersService } from '../vouchers/vouchers.service';
import { EVoucherType } from 'src/common/enums/voucher.enum';
import { ProductEntity } from 'src/database/entities/product.entity';
import { ProductsService } from '../products/products.service';
import { StoreEntity } from 'src/database/entities/store.entity';
import { FlashSalesService } from '../flash-sales/flash-sales.service';
import { FlashSaleEntity } from 'src/database/entities/flash-sale.entity';
import { getDistanceQuery } from 'src/utils/distance';
import { StoreView } from 'src/database/views/store.view';

@Controller('stores')
@ApiTags('Client Stores')
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
    private readonly productCategoriesService: ProductCategoriesService,
    private readonly productsService: ProductsService,
    private readonly vouchersService: VouchersService,
    private readonly flashSalesService: FlashSalesService,
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
    const { limit, page, productCategoryCode, isOpening, isDiscount, isFlashSale, search } = query;
    // tọa độ sample
    const latitude = 21.028511;
    const longitude = 105.804817;

    const normalizedSearch = normalizeText(search).replace(/ /g, ' | ');
    const now = moment().tz(TIMEZONE);
    const dayOfWeek = now.day();
    const totalMinutes = now.hours() * 60 + now.minutes();
    const currentTime = moment().tz(TIMEZONE).format('HH:mm:ss');

    const queryExistVoucher = (storeAlias: string) => {
      return this.vouchersService
        .createQueryBuilder('voucher')
        .select('1')
        .leftJoin('voucher.stores', 'voucherStore')
        .leftJoin('voucher.products', 'voucherProduct')
        .where('voucher.startTime <= CURRENT_TIMESTAMP')
        .andWhere('voucher.endTime >= CURRENT_TIMESTAMP')
        .andWhere('voucher.isActive = true')
        .andWhere(
          new Brackets((qb) => {
            qb.where(`voucher.createdByStoreId = ${storeAlias}.id`);
            qb.orWhere(`voucherStore.id = ${storeAlias}.id`);
          }),
        )
        .limit(1);
    };

    const queryBuilderVoucher = this.vouchersService
      .createQueryBuilder('voucher')
      .select(
        `json_agg(json_build_object('id', voucher.id, 'code', voucher.code, 'refundType', voucher.refundType, 'discountType', voucher.discountType, 'discountValue', voucher.discountValue, 'minOrderValue', voucher.minOrderValue, 'maxDiscountValue', voucher.maxDiscountValue, 'maxDiscountType', voucher.maxDiscountType))`,
        'vouchers',
      )
      .leftJoin('voucher.stores', 'voucherStore')
      .where('voucher.startTime <= CURRENT_TIMESTAMP')
      .andWhere('voucher.endTime >= CURRENT_TIMESTAMP')
      .andWhere('voucher.isActive = true')
      .andWhere(
        new Brackets((qb) => {
          qb.where('voucher.createdByStoreId = store.id');
          qb.orWhere('voucherStore.id = store.id');
        }),
      );

    const queryBuilder = this.storesService
      .createStoreViewQueryBuilder('store')
      .select([
        'store.id as "storeId"',
        'store.name as "storeName"',
        'store.specialDish as "storeSpecialDish"',
        'store.streetName as "storeStreetName"',
        'store.storeAvatarId as "storeStoreAvatarId"',
        'store.avgRating as "storeAvgRating"',
        'store_pagination.distance as "distance"',
        `ts_rank_cd(to_tsvector('simple', store.nameUnaccent), to_tsquery('simple', :search)) as "store_rank"`,
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
              'ROW_NUMBER() OVER (PARTITION BY product.storeId ORDER BY product.id DESC) as rownum',
            ])
            .where('product.status = :productStatus')
            .andWhere('product.approvalStatus = :productApprovalStatus');

          if (normalizedSearch) {
            subQueryBuilder.addSelect(
              `ts_rank_cd(to_tsvector('simple', unaccent(product.name)), to_tsquery('simple', :search))`,
              'product_rank',
            );
            subQueryBuilder.orderBy('product_rank', 'ASC');
          }

          if (productCategoryCode) {
            subQueryBuilder.innerJoin('product.productCategory', 'productCategory');
            subQueryBuilder.andWhere(
              new Brackets((qb) => {
                qb.where('productCategory.id = :productCategoryCode');
                qb.orWhere('productCategory.parentId = :productCategoryCode');
              }),
            );
          }

          return subQueryBuilder;
        },
        'products',
        'products."storeId" = store.id AND products.rownum <= 10',
      )
      .leftJoinAndSelect(
        (subQuery) => {
          subQuery.getQuery = () => `LATERAL (${queryBuilderVoucher.getQuery()})`;
          subQuery.getParameters = () => queryBuilderVoucher.getParameters();
          return subQuery;
        },
        'vouchers',
        'true',
      )

      .andWhere('store.isPause = false')
      .andWhere('store.status = :storeStatus')
      .andWhere('store.approvalStatus = :storeApprovalStatus')
      .setParameters({ storeStatus: EStoreStatus.Active, storeApprovalStatus: EStoreApprovalStatus.Approved })
      .setParameters({ productStatus: EProductStatus.Active, productApprovalStatus: EStoreApprovalStatus.Approved })
      .setParameters({ productCategoryCode: +productCategoryCode })
      .setParameters({ search: normalizedSearch });

    if (normalizedSearch) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(`to_tsvector('simple', store.nameUnaccent) @@ to_tsquery('simple', :search)`);
          qb.orWhere(
            `EXISTS (${queryBuilder
              .subQuery()
              .select('1')
              .from(ProductEntity, 'product')
              .where('product.storeId = store.id')
              .andWhere('product.status = :productStatus')
              .andWhere('product.approvalStatus = :productApprovalStatus')
              .andWhere(`to_tsvector('simple', unaccent(product.name)) @@ to_tsquery('simple', :search)`)
              .getQuery()})`,
          );
        }),
      );
    }

    if (isOpening) {
      queryBuilder.andWhereExists(
        this.storesService
          .createQueryBuilder('store')
          .select('1')
          .innerJoin('store.workingTimes', 'workingTime')
          .where('workingTime.dayOfWeek = :dayOfWeek')
          .andWhere('workingTime.openTime <= :totalMinutes')
          .andWhere('workingTime.closeTime >= :totalMinutes')
          .setParameters({ dayOfWeek, totalMinutes }),
      );
    }

    const subQueryFlashSale = (storeAlias = 'store', subQuery?) => {
      if (!subQuery) {
        subQuery = this.flashSalesService.createQueryBuilder('flashSale');
      } else {
        subQuery = subQuery.from(FlashSaleEntity, 'flashSale');
      }

      return subQuery
        .select('COUNT(1)', 'flashSaleCount')
        .leftJoin('flashSale.timeFrame', 'timeFrame')
        .leftJoin('flashSale.products', 'flashSaleProduct')
        .leftJoin('flashSaleProduct.product', 'product')
        .where('flashSale.startDate <= CURRENT_TIMESTAMP')
        .andWhere('flashSale.endDate >= CURRENT_TIMESTAMP')
        .andWhere('flashSale.status = true')
        .andWhere('timeFrame.startTime <= :currentTime')
        .andWhere('timeFrame.endTime >= :currentTime')
        .andWhere(`product.storeId = ${storeAlias}.id`)
        .setParameters({ currentTime });
    };

    queryBuilder.addSelect((subQuery) => subQueryFlashSale('store', subQuery), 'flashSaleCount');
    isFlashSale && queryBuilder.andWhereExists(subQueryFlashSale());
    isDiscount && queryBuilder.andWhereExists(queryExistVoucher('store'));

    const total = await queryBuilder.getCount();

    queryBuilder.innerJoin(
      (subQuery) => {
        const subQueryProduct = this.productsService
          .createQueryBuilder('product')
          .select('1')
          .where('product.storeId = store_pagination.id')
          .andWhere('product.status = :productStatus')
          .andWhere('product.approvalStatus = :productApprovalStatus')
          .limit(1);

        if (productCategoryCode) {
          subQueryProduct.innerJoin('product.productCategory', 'productCategory');
          subQueryProduct.andWhere(
            new Brackets((qb) => {
              qb.where('productCategory.id = :productCategoryCode');
              qb.orWhere('productCategory.parentId = :productCategoryCode');
            }),
          );
        }

        const subQueryBuilder = subQuery
          .select('store_pagination.id', 'id')
          .addSelect(
            `${getDistanceQuery('store_pagination.receive_lat', 'store_pagination.receive_lng', latitude, longitude)} as "distance"`,
          )
          .from(StoreView, 'store_pagination')
          .andWhere('store_pagination.isPause = false')
          .andWhere('store_pagination.status = :storeStatus')
          .andWhere('store_pagination.approvalStatus = :storeApprovalStatus')
          .andWhereExists(subQueryProduct)
          .setParameter('storeStatus', EStoreStatus.Active)
          .setParameter('storeApprovalStatus', EStoreApprovalStatus.Approved)
          .limit(limit)
          .offset((page - 1) * limit);

        isDiscount && subQueryBuilder.andWhereExists(queryExistVoucher('store_pagination'));
        isFlashSale && subQueryBuilder.andWhereExists(subQueryFlashSale('store_pagination'));

        if (normalizedSearch) {
          subQueryBuilder.andWhere(
            new Brackets((qb) => {
              qb.where(`to_tsvector('simple', store_pagination.nameUnaccent) @@ to_tsquery('simple', :search)`);
              qb.orWhere(
                `EXISTS (${subQueryProduct.andWhere(`to_tsvector('simple', unaccent(product.name)) @@ to_tsquery('simple', :search)`).getQuery()})`,
              );
            }),
          );
        }

        if (isOpening) {
          subQueryBuilder.andWhereExists(
            this.storesService
              .createQueryBuilder('store')
              .select('1')
              .innerJoin('store.workingTimes', 'workingTime')
              .where('workingTime.dayOfWeek = :dayOfWeek')
              .andWhere('workingTime.openTime <= :totalMinutes')
              .andWhere('workingTime.closeTime >= :totalMinutes')
              .setParameters({ dayOfWeek, totalMinutes }),
          );
        }

        subQueryBuilder.addOrderBy('distance', 'ASC');
        return subQueryBuilder;
      },
      'store_pagination',
      '"store_pagination".id = store.id',
    );

    if (normalizedSearch) {
      queryBuilder.orderBy('store_rank', 'DESC');
      queryBuilder.addOrderBy('products.product_rank', 'DESC');
    }
    queryBuilder.addOrderBy('distance', 'ASC');

    const rawItems = await queryBuilder.getRawMany();

    const storeMap = new Map<string, any>();
    rawItems.forEach((item) => {
      const store = storeMap.get(item.storeId);

      if (!store) {
        storeMap.set(item.storeId, {
          id: item.storeId,
          name: item.storeName,
          specialDish: item.storeSpecialDish,
          streetName: item.storeStreetName,
          storeAvatarId: item.storeStoreAvatarId,
          distance: item.distance,
          duration: (item.distance / DRIVER_SPEED) * 60,
          avgRating: item.storeAvgRating,
          isFlashSale: parseInt(item.flashSaleCount) > 0,
          products: [],
          vouchers: [],
        });
      }

      if (item.id) {
        storeMap.get(item.storeId).products.push({
          id: item.id,
          name: item.name,
          price: item.price,
          imageId: item.imageId,
        });
      }

      if (item.vouchers) {
        storeMap.get(item.storeId).vouchers = item.vouchers.slice(0, 3);
      }
    });

    const items = Array.from(storeMap.values());
    return { items, total };

    // const stores = lodash.groupBy(rawItems, 'storeId') as Record<string, any[]>;

    // console.log(rawItems);
    // const items = Object.values(stores).map((store) => {
    //   const [first] = store;
    //   // console.log(first);
    //   return {
    //     id: first.storeId,
    //     name: first.storeName,
    //     specialDish: first.storeSpecialDish,
    //     streetName: first.storeStreetName,
    //     storeAvatarId: first.storeStoreAvatarId,
    //     isFlashSale: parseInt(first.flashSaleCount) > 0,
    //     rating: 0,
    //     distance: first.distance,
    //     avgRating: Number(first.storeAvgRating),
    //     products: store.map((item) => ({
    //       id: item.id,
    //       name: item.name,
    //       price: item.price,
    //       imageId: item.imageId,
    //       storeId: item.storeId,
    //     })),
    //     vouchers: first.vouchers ? first.vouchers.slice(0, 3) : [],
    //   };
    // });

    // return { items, total };
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
      // nếu là now thì check xem hôm nay có khung giờ nào không
      const isToday = formattedDate === currentDate;
      if (isToday) {
        const openSlot = workingTimes.find(
          (item) => item.dayOfWeek === dayOfWeek && item.openTime <= currentTime && item.closeTime >= currentTime,
        );
        if (openSlot) {
          result.push({ date: formattedDate, openSlots: [{ openTime: currentTime, closeTime: openSlot.closeTime }] });
          count++;
        }
      }

      let openSlots = workingTimes
        .filter((item) => item.dayOfWeek === nowTemp.day())
        .map((item) => {
          return { openTime: item.openTime, closeTime: item.closeTime };
        });

      // nếu hôm nay

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

  @Get(':storeId/vouchers')
  @ApiOperation({ summary: 'Get store vouchers' })
  async findVouchers(@Param('storeId') storeId: number) {
    const now = new Date();

    return this.vouchersService
      .createQueryBuilder('voucher')
      .leftJoin('voucher.stores', 'store')
      .where('voucher.startTime <= :now')
      .andWhere('voucher.endTime >= :now')
      .andWhere('voucher.isActive = true')
      .andWhere('voucher.isPrivate = false')
      .andWhere(
        new Brackets((qb) => {
          qb.orWhere(`voucher.typeId = ${EVoucherType.AllStore}`);
          qb.orWhere(
            new Brackets((qb) => {
              qb.where(`voucher.typeId = ${EVoucherType.Store}`);
              qb.andWhere(
                new Brackets((qb) => {
                  qb.where('voucher.isAllItems = true');
                  qb.orWhere('store.id = :storeId', { storeId });
                }),
              );
            }),
          );
        }),
      )
      .setParameter('now', now)
      .getMany();
  }
}
