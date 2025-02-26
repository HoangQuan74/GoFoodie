import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EXCEPTIONS } from 'src/common/constants';
import { ORDER_GROUP_FULL } from 'src/common/constants/common.constant';
import { EOrderGroupStatus, EOrderStatus } from 'src/common/enums';
import { OrderGroupItemEntity } from 'src/database/entities/order-group-item.entity';
import { OrderGroupEntity } from 'src/database/entities/order-group.entity';
import { OrderEntity } from 'src/database/entities/order.entity';
import { OrderCriteriaService } from 'src/modules/order-criteria/order-criteria.service';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class OrderGroupService {
  constructor(
    @InjectRepository(OrderGroupEntity)
    private orderGroupRepository: Repository<OrderGroupEntity>,

    @InjectRepository(OrderGroupItemEntity)
    private orderGroupItemRepository: Repository<OrderGroupItemEntity>,

    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,

    private readonly orderCriteriaService: OrderCriteriaService,
  ) {}

  async getCurrentOrderGroup(driverId: number, isConfirmByDriver: Boolean) {
    const queryBuilder = this.orderGroupItemRepository
      .createQueryBuilder('orderGroupItem')
      .innerJoin('orderGroupItem.orderGroup', 'orderGroup')
      .innerJoin('orderGroupItem.order', 'order')
      .leftJoin('order.client', 'client')
      .leftJoin('order.store', 'store')
      .leftJoinAndMapOne(
        'order.orderInDelivery',
        'order.activities',
        'orderInDelivery',
        'orderInDelivery.orderId = order.id AND orderInDelivery.status = :statusInDelivery',
        { statusInDelivery: EOrderStatus.InDelivery },
      )
      .leftJoinAndMapOne(
        'order.orderDelivered',
        'order.activities',
        'orderDelivered',
        'orderDelivered.orderId = order.id AND orderDelivered.status = :statusDelivered',
        { statusDelivered: EOrderStatus.Delivered },
      )
      .where('orderGroup.driverId = :driverId', { driverId })
      .andWhere('orderGroup.status = :status', { status: EOrderGroupStatus.InDelivery })
      .select([
        'orderGroupItem.id',
        'orderGroupItem.isConfirmByDriver',
        'order.id',
        'order.orderCode',
        'order.estimatedOrderTime',
        'order.estimatedPickupTime',
        'order.estimatedDeliveryTime',
        'order.deliveryAddress',
        'order.deliveryName',
        'order.deliveryLatitude',
        'order.deliveryLongitude',
        'order.status',
        'client.id',
        'client.name',
        'client.phone',
        'store.id',
        'store.name',
        'store.address',
        'store.streetName',
        'store.latitude',
        'store.longitude',
        'store.phoneNumber',
      ]);

    const queryIncomeOfDriver = await this.orderGroupItemRepository
      .createQueryBuilder('orderGroupItem')
      .innerJoin('orderGroupItem.orderGroup', 'orderGroup')
      .innerJoin('orderGroupItem.order', 'order')
      .where('orderGroup.driverId = :driverId', { driverId })
      .andWhere('orderGroup.status = :status', { status: EOrderGroupStatus.InDelivery })
      .select(
        `
        SUM(
          COALESCE(order.tip, 0) + 
          COALESCE(order.deliveryFee, 0) + 
          COALESCE(order.peakHourFee, 0) + 
          COALESCE(order.parkingFee, 0)
        )`,
        'totalIncome',
      )
      .groupBy('orderGroup.id');

    if (isConfirmByDriver) {
      queryBuilder.andWhere('orderGroupItem.isConfirmByDriver = :isConfirmByDriver', { isConfirmByDriver });
      queryIncomeOfDriver.andWhere('orderGroupItem.isConfirmByDriver = :isConfirmByDriver', { isConfirmByDriver });
    }

    const result = await queryBuilder.orderBy('order.createdAt', 'DESC').getMany();
    const incomeOfDriver = await queryIncomeOfDriver.getRawOne();

    const criteria = await this.orderCriteriaService.getTimeCountDownToDriverConfirm();
    return { result, incomeOfDriver: Number(incomeOfDriver?.totalIncome) || 0, criteria };
  }

  async upsertOrderGroup(orderId: number, driverId: number) {
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) {
      throw new BadRequestException(EXCEPTIONS.NOT_FOUND);
    }

    let orderGroup = await this.orderGroupRepository.findOne({
      where: {
        driverId: driverId,
        status: EOrderGroupStatus.InDelivery,
      },
      relations: { orderGroupItems: true },
      select: {
        id: true,
        orderGroupItems: {
          id: true,
        },
      },
    });

    if (!orderGroup) {
      orderGroup = await this.orderGroupRepository.save({
        driverId: driverId,
        status: EOrderGroupStatus.InDelivery,
      });
    } else {
      if (orderGroup.orderGroupItems?.length >= ORDER_GROUP_FULL) {
        throw new BadRequestException(EXCEPTIONS.ORDER_GROUP_FULL);
      }
    }

    return await this.orderGroupItemRepository.save({
      orderGroup: orderGroup,
      order: order,
    });
  }

  async updateOrderGroupItem(data: { orderId: number; driverId: number; isConfirmByDriver: boolean }) {
    const { orderId, driverId, isConfirmByDriver } = data;
    const orderGroupItem = await this.orderGroupItemRepository.findOne({
      where: {
        orderId: orderId,
        orderGroup: {
          driverId: driverId,
        },
      },
    });

    if (!orderGroupItem) {
      throw new BadRequestException(EXCEPTIONS.NOT_FOUND);
    }

    orderGroupItem.isConfirmByDriver = isConfirmByDriver;

    return await this.orderGroupItemRepository.save(orderGroupItem);
  }

  async rejectOrderGroupItem(orderId: number, driverId: number) {
    const orderGroupItem = await this.orderGroupItemRepository.findOne({
      where: {
        orderId: orderId,
        orderGroup: {
          driverId: driverId,
        },
      },
    });

    if (!orderGroupItem) {
      return;
    }

    await this.orderGroupItemRepository.softRemove(orderGroupItem);
    await this.updateOrderGroupByDriverId(driverId);
    return;
  }

  async updateOrderGroupByDriverId(driverId: number): Promise<void> {
    const countOrderOfGroup = await this.orderGroupItemRepository.count({
      where: {
        orderGroup: {
          driverId: driverId,
          status: EOrderGroupStatus.InDelivery,
        },
      },
    });

    const countCompleteOrderOfGroup = await this.orderGroupItemRepository
      .createQueryBuilder('ogi')
      .leftJoin('ogi.order', 'order')
      .leftJoin('ogi.orderGroup', 'orderGroup')
      .where('orderGroup.driverId = :driverId', { driverId })
      .andWhere('orderGroup.status = :status', { status: EOrderGroupStatus.InDelivery })
      .andWhere(
        new Brackets((qb) => {
          qb.where('order.status = :deliveredStatus AND order.driverId = :driverId', {
            deliveredStatus: EOrderStatus.Delivered,
            driverId,
          }).orWhere(' order.driverId != :driverId', { driverId });
        }),
      )
      .getCount();

    if (countOrderOfGroup === countCompleteOrderOfGroup) {
      await this.orderGroupRepository.update(
        {
          driverId: driverId,
          status: EOrderGroupStatus.InDelivery,
        },
        {
          status: EOrderGroupStatus.Delivered,
        },
      );
    }
  }
}
