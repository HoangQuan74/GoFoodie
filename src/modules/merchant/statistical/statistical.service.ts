import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EOrderStatus, TimeRange } from 'src/common/enums';
import { OrderEntity } from 'src/database/entities/order.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { ProductEntity } from 'src/database/entities/product.entity';
import { PaginationQuery } from 'src/common/query';

@Injectable()
export class StatisticalService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async getRevenueChart(type: TimeRange, storeId: number) {
    const now = moment().tz('Asia/Ho_Chi_Minh');
    let startDate: moment.Moment, interval: string, format: string, previousTime: moment.Moment;

    if (type === TimeRange.DAY) {
      startDate = now.clone().startOf('day');
      interval = '4 hours';
      format = 'HH:00';
      previousTime = startDate.subtract(1, 'days');
    } else if (type === TimeRange.WEEK) {
      startDate = now.clone().subtract(6, 'days').startOf('day');
      interval = '1 day';
      format = 'YYYY-MM-DD';
      previousTime = startDate.subtract(7, 'days');
    } else {
      startDate = now.clone().subtract(29, 'days').startOf('day');
      interval = '1 day';
      format = 'YYYY-MM-DD';
      previousTime = startDate.subtract(30, 'days');
    }

    const revenueData = await this.getRevenueData(storeId, startDate, interval, format);
    const revenue = await this.getRevenue(startDate, now.endOf('day'), storeId);
    const previousRevenue = await this.getRevenue(previousTime, startDate, storeId);

    return {
      revenue,
      growRate: previousRevenue === 0 ? null : (revenue - previousRevenue) / previousRevenue,
      revenueData,
    };
  }

  private async getRevenue(startDate: moment.Moment, endDate: moment.Moment, storeId: number): Promise<number> {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.storeId = :storeId', { storeId })
      .andWhere('order.createdAt >= :startDate AND order.createdAt < :endDate', {
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
      })
      .andWhere('order.status = :status', { status: EOrderStatus.Delivered })
      .select('SUM(order.totalAmount)', 'total')
      .getRawOne();
    return Number(result.total) || 0;
  }

  private async getRevenueData(storeId: number, startDate: moment.Moment, interval: string, format: string) {
    const endDate = moment().tz('Asia/Ho_Chi_Minh').endOf('day');
    const revenueMap = new Map<string, number>();

    let tempDate = startDate.clone();
    while (tempDate.isSameOrBefore(endDate)) {
      const key = tempDate.format(format);
      revenueMap.set(key, 0);

      if (interval === '4 hours' && tempDate.format('HH:mm') === '20:00') {
        const midnightKey = '24:00';
        revenueMap.set(midnightKey, 0);
      }

      tempDate.add(interval === '4 hours' ? 4 : 1, interval === '4 hours' ? 'hours' : 'days');
    }

    const timeFormat = format === 'HH:00' ? 'HH24:00' : 'YYYY-MM-DD';
    const query = this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .addSelect(`to_char(order.createdAt, '${timeFormat}')`, 'time')
      .where('order.storeId = :storeId', { storeId })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
      })
      .andWhere('order.status = :status', { status: EOrderStatus.Delivered })
      .groupBy('time');

    const orders = await query.getRawMany();

    orders.forEach((order) => {
      if (revenueMap.has(order.time)) {
        revenueMap.set(order.time, parseFloat(order.total));
      }
    });

    return Array.from(revenueMap, ([time, total]) => ({ time, total }));
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
