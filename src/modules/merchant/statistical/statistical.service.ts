import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EOrderStatus, TimeRangeV2 } from 'src/common/enums';
import { OrderEntity } from 'src/database/entities/order.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { ProductEntity } from 'src/database/entities/product.entity';
import { PaginationQuery } from 'src/common/query';
import { StoreEntity } from 'src/database/entities/store.entity';

@Injectable()
export class StatisticalService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,
  ) {}

  async getRevenueChart(type: TimeRangeV2, storeId: number) {
    const now = moment();
    let startDate: moment.Moment, interval: string, format: string, previousTime: moment.Moment, endDate: moment.Moment;
    endDate = now.clone().endOf('day');

    switch (type) {
      case TimeRangeV2.TODAY:
        startDate = now.clone().startOf('day');
        interval = '4 hours';
        format = 'HH:00';
        previousTime = startDate.clone().subtract(1, 'days');
        break;

      case TimeRangeV2.YESTERDAY:
        startDate = now.clone().subtract(1, 'days').startOf('day');
        endDate = now.clone().subtract(1, 'days').endOf('day');
        interval = '4 hours';
        format = 'HH:00';
        previousTime = startDate.clone().subtract(1, 'days');
        break;

      case TimeRangeV2.LAST_7_DAYS:
        startDate = now.clone().subtract(6, 'days').startOf('day');
        interval = '1 day';
        format = 'YYYY-MM-DD';
        previousTime = startDate.clone().subtract(7, 'days');
        break;

      case TimeRangeV2.LAST_30_DAYS:
        startDate = now.clone().subtract(29, 'days').startOf('day');
        interval = '5 day';
        format = 'YYYY-MM-DD';
        previousTime = startDate.clone().subtract(30, 'days');
        break;
    }

    const revenueData = await this.getRevenueData(storeId, startDate.clone(), endDate.clone(), interval, format);
    const revenue = await this.getRevenue(startDate.clone(), endDate.clone(), storeId);
    const previousRevenue = await this.getRevenue(previousTime.clone(), startDate.clone(), storeId);
    const store = await this.storeRepository
      .createQueryBuilder('store')
      .where('store.id = :storeId', { storeId })
      .leftJoin('store.title', 'title')
      .leftJoin('store.clientReviewStore', 'clientReviewStore')
      .select('store.id', 'storeId')
      .addSelect('AVG(clientReviewStore.rating)', 'avgRating')
      .addSelect('title.id', 'titleId')
      .addSelect('title.title', 'title')
      .addSelect('title.iconId', 'iconId')
      .groupBy('store.id')
      .addGroupBy('title.id')
      .getRawOne();

    return {
      store,
      updatedAt: new Date(),
      revenue: revenue.total,
      revenueGrowthRate:
        previousRevenue.total === 0 ? null : ((revenue.total - previousRevenue.total) / previousRevenue.total) * 100,
      quantityOrder: revenue.quantityOrder,
      orderQuantityGrowthRate:
        previousRevenue.quantityOrder === 0
          ? null
          : ((revenue.quantityOrder - previousRevenue.quantityOrder) / previousRevenue.quantityOrder) * 100,
      revenueData,
    };
  }

  private async getRevenue(startDate: moment.Moment, endDate: moment.Moment, storeId: number) {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.storeId = :storeId', { storeId })
      .andWhere('order.createdAt >= :startDate AND order.createdAt < :endDate', {
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
      })
      .andWhere('order.status = :status', { status: EOrderStatus.Delivered })
      .select('SUM(order.totalAmount)', 'total')
      .addSelect('COUNT(order.id)', 'quantityOrder')
      .getRawOne();

    return {
      total: Number(result?.total) || 0,
      quantityOrder: Number(result?.quantityOrder) || 0,
    };
  }

  private async getRevenueData(
    storeId: number,
    startDate: moment.Moment,
    endDate: moment.Moment,
    interval: string,
    format: string,
  ) {
    const revenueMap = new Map<string, { total: number; countOrder: number }>();

    let tempDate = startDate.clone();
    if (interval === '5 day') tempDate = startDate.clone().subtract(1, 'days');

    while (tempDate.isSameOrBefore(endDate)) {
      const key = tempDate.format(format);
      revenueMap.set(key, { total: 0, countOrder: 0 });

      tempDate.add(
        interval === '4 hours' ? 4 : interval === '1 day' ? 1 : 5,
        interval === '4 hours' ? 'hours' : 'days',
      );
    }

    const timeFormat = format === 'HH:00' ? 'HH24:00' : 'YYYY-MM-DD';
    if (interval === '4 hours') {
      const midnightKey = '24:00';
      revenueMap.set(midnightKey, { total: 0, countOrder: 0 });
    } else if (interval === '5 day') {
      const key = endDate.clone().format(format);
      revenueMap.set(key, { total: 0, countOrder: 0 });
    }

    const query = this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .addSelect('COUNT(order.id)', 'quantityOrder')
      .addSelect(`to_char(order.createdAt AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Ho_Chi_Minh', '${timeFormat}')`, 'time')
      .where('order.storeId = :storeId', { storeId })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
      })
      .andWhere('order.status = :status', { status: EOrderStatus.Delivered })
      .groupBy('time');

    const orders = await query.getRawMany();
    orders.forEach((order) => {
      const orderTime = moment(order.time, format);
      let roundedTime;
      if (interval === '4 hours') {
        roundedTime = orderTime
          .clone()
          .add(4 - (orderTime.hour() % 4), 'hours')
          .format(format);
      } else if (interval === '5 day') {
        const diffDays = orderTime.diff(startDate, 'days');
        const adjustedDays = Math.floor(diffDays / 5) * 5 + 4;
        roundedTime = startDate.clone().add(adjustedDays, 'days').format(format);
      } else {
        roundedTime = orderTime.format(format);
      }

      if (revenueMap.has(roundedTime)) {
        const currentData = revenueMap.get(roundedTime);
        revenueMap.set(roundedTime, {
          total: currentData.total + parseFloat(order.total),
          countOrder: currentData.countOrder + Number(order.quantityOrder),
        });
      }
    });

    return Array.from(revenueMap.entries(), ([time, { total, countOrder }]) => ({
      time,
      total,
      countOrder,
    }));
  }

  async getTopProductsRevenue(storeId: number, query: PaginationQuery) {
    const { page, limit } = query;
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.orderItems', 'orderItem')
      .leftJoin('orderItem.order', 'order')
      .where('product.storeId = :storeId', { storeId })
      .andWhere('order.status = :status', { status: EOrderStatus.Delivered })
      .select('product.id', 'id')
      .addSelect('product.name', 'name')
      .addSelect('product.imageId', 'imageId')
      .addSelect('SUM(orderItem.price * orderItem.quantity)', 'totalAmount')
      .groupBy('product.id')
      .orderBy('SUM(orderItem.price * orderItem.quantity)', 'DESC')
      .take(limit)
      .skip((page - 1) * limit)
      .getRawMany();

    return products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        imageId: product.imageId,
        totalAmount: Number(product.totalAmount),
      };
    });
  }

  async getTopProductsSold(storeId: number, query: PaginationQuery) {
    const { page, limit } = query;
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.orderItems', 'orderItem')
      .leftJoin('orderItem.order', 'order')
      .where('product.storeId = :storeId', { storeId })
      .andWhere('order.status = :status', { status: EOrderStatus.Delivered })
      .select('product.id', 'id')
      .addSelect('product.name', 'name')
      .addSelect('product.imageId', 'imageId')
      .addSelect('SUM(orderItem.quantity)', 'quantity')
      .groupBy('product.id')
      .orderBy('SUM(orderItem.quantity)', 'DESC')
      .take(limit)
      .skip((page - 1) * limit)
      .getRawMany();

    return products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        imageId: product.imageId,
        quantity: Number(product.quantity),
      };
    });
  }
}
