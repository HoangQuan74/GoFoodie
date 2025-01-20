import { BadRequestException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EOrderStatus } from 'src/common/enums/order.enum';
import { OrderEntity } from 'src/database/entities/order.entity';
import { StoreEntity } from 'src/database/entities/store.entity';
import { OrderActivityEntity } from 'src/database/entities/order-activities.entity';
import { DataSource, Repository } from 'typeorm';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(StoreEntity)
    private storeRepository: Repository<StoreEntity>,
    @InjectRepository(OrderActivityEntity)
    private orderActivityRepository: Repository<OrderActivityEntity>,
    private dataSource: DataSource,
  ) {}

  async queryOrders(merchantId: number, queryOrderDto: QueryOrderDto) {
    const store = await this.getStoreByMerchantId(merchantId);

    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('order.activities', 'activities')
      .where('order.storeId = :storeId', { storeId: store.id });

    if (queryOrderDto.status) {
      query.andWhere('order.status = :status', { status: queryOrderDto.status });
    }

    if (queryOrderDto.paymentStatus) {
      query.andWhere('order.paymentStatus = :paymentStatus', { paymentStatus: queryOrderDto.paymentStatus });
    }

    if (queryOrderDto.keyword) {
      query.andWhere('(client.name LIKE :keyword OR order.id::text LIKE :keyword)', {
        keyword: `%${queryOrderDto.keyword}%`,
      });
    }

    if (queryOrderDto.startDate && queryOrderDto.endDate) {
      query.andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: queryOrderDto.startDate,
        endDate: queryOrderDto.endDate,
      });
    }

    query
      .orderBy(`order.${queryOrderDto.sortBy || 'createdAt'}`, queryOrderDto.sortOrder || 'DESC')
      .skip((queryOrderDto.page - 1) * queryOrderDto.limit)
      .take(queryOrderDto.limit);

    const [orders, total] = await query.getManyAndCount();

    return {
      orders,
      total,
      page: queryOrderDto.page,
      limit: queryOrderDto.limit,
      totalPages: Math.ceil(total / queryOrderDto.limit),
    };
  }

  async confirmOrder(merchantId: number, orderId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await this.orderRepository.findOne({
        where: {
          id: orderId,
          store: {
            merchantId: merchantId,
          },
        },
        relations: ['store'],
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found or does not belong to this merchant`);
      }

      if (order.status !== EOrderStatus.Pending) {
        throw new BadRequestException('Only pending orders can be confirmed');
      }

      order.status = EOrderStatus.Confirmed;
      await queryRunner.manager.save(order);

      const orderActivity = this.orderActivityRepository.create({
        orderId: order.id,
        status: EOrderStatus.Confirmed,
        description: 'Order confirmed by merchant',
        performedBy: `merchant:${merchantId}`,
      });
      await queryRunner.manager.save(orderActivity);

      await queryRunner.commitTransaction();

      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to confirm order: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async cancelOrder(merchantId: number, orderId: number, updateOrderDto: UpdateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await this.orderRepository.findOne({
        where: {
          id: orderId,
          store: {
            merchantId: merchantId,
          },
        },
        relations: ['store'],
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found or does not belong to this merchant`);
      }

      if (order.status !== EOrderStatus.Pending) {
        throw new BadRequestException('Only pending orders can be cancelled');
      }

      order.status = EOrderStatus.Cancelled;
      await queryRunner.manager.save(order);

      const orderActivity = this.orderActivityRepository.create({
        orderId: order.id,
        status: EOrderStatus.Cancelled,
        description: 'Order cancelled by merchant',
        performedBy: `merchant:${merchantId}`,
        cancellationReason: updateOrderDto.reasons || '',
        cancellationType: 'merchant',
      });
      await queryRunner.manager.save(orderActivity);

      await queryRunner.commitTransaction();

      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to cancel order: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  private async getStoreByMerchantId(merchantId: number): Promise<StoreEntity> {
    const store = await this.storeRepository.findOne({ where: { merchantId } });
    if (!store) {
      throw new NotFoundException(`Store not found for merchant with ID ${merchantId}`);
    }
    return store;
  }
}
