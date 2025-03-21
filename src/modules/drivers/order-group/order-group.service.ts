import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment-timezone';
import { EXCEPTIONS } from 'src/common/constants';
import { ORDER_GROUP_FULL } from 'src/common/constants/common.constant';
import { EOrderGroupStatus, EOrderStatus, EUserType } from 'src/common/enums';
import { OrderGroupItemEntity } from 'src/database/entities/order-group-item.entity';
import { OrderGroupEntity } from 'src/database/entities/order-group.entity';
import { OrderEntity } from 'src/database/entities/order.entity';
import { OrderCriteriaService } from 'src/modules/order-criteria/order-criteria.service';
import { Brackets, Repository } from 'typeorm';
import { UpdateOrderGroupItemDto } from './dto';
import { isEmpty } from 'lodash';

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

  async getCurrentOrderGroup(driverId: number, isConfirmByDriver: boolean) {
    const queryBuilder = this.orderGroupItemRepository
      .createQueryBuilder('orderGroupItem')
      .innerJoin('orderGroupItem.orderGroup', 'orderGroup')
      .innerJoin('orderGroupItem.order', 'order')
      .leftJoinAndSelect('order.orderItems', 'orderItem')
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
      .leftJoinAndMapOne(
        'order.orderSystemAssignToDriver',
        'order.activities',
        'orderSystemAssignToDriver',
        `orderSystemAssignToDriver.orderId = order.id 
        AND orderSystemAssignToDriver.status = :statusSystemAssignToDriver 
        AND orderSystemAssignToDriver.performedBy = :performedBy`,
        { statusSystemAssignToDriver: EOrderStatus.OfferSentToDriver, performedBy: `driverId:${driverId}` },
      )
      .where('orderGroup.driverId = :driverId', { driverId })
      .andWhere('orderGroup.status = :status', { status: EOrderGroupStatus.InDelivery })
      .addSelect([
        'order.id',
        'order.orderCode',
        'order.orderTime',
        'order.estimatedPickupTime',
        'order.estimatedDeliveryTime',
        'order.deliveryAddress',
        'order.deliveryName',
        'order.deliveryLatitude',
        'order.deliveryLongitude',
        'order.status',
        'order.totalAmount',
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

    const result = await queryBuilder
      .orderBy('orderGroupItem.isConfirmByDriver', 'DESC')
      .addOrderBy('order.createdAt', 'ASC')
      .getMany();
    const incomeOfDriver = await queryIncomeOfDriver.getRawOne();

    const criteria = await this.orderCriteriaService.getTimeCountDownToDriverConfirm();

    result.forEach((orderGroupItem) => {
      if (!orderGroupItem.isConfirmByDriver) {
        const order = orderGroupItem.order;
        if (order?.orderSystemAssignToDriver?.createdAt) {
          const createdAt = moment(order.orderSystemAssignToDriver.createdAt).unix();
          const now = moment().unix();

          const remaining = criteria - (now - createdAt) || 15;
          orderGroupItem.order.remaining = remaining < 0 ? 0 : remaining;
        }
      }
    });

    return {
      result: result.map((order) => {
        return {
          ...order,
          criteria,
        };
      }),
      incomeOfDriver: Number(incomeOfDriver?.totalIncome) || 0,
      criteria,
    };
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

  async getCardStoreAndClient(driverId: number, isConfirmByDriver: boolean) {
    const queryBuilder = this.orderGroupItemRepository
      .createQueryBuilder('orderGroupItem')
      .leftJoin('orderGroupItem.orderGroup', 'orderGroup')
      .leftJoin('orderGroupItem.order', 'order')
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .where('orderGroup.driverId = :driverId', { driverId })
      .andWhere('orderGroup.status = :status', { status: EOrderGroupStatus.InDelivery })
      .addSelect([
        'order.id',
        'order.orderCode',
        'order.orderTime',
        'order.estimatedPickupTime',
        'order.estimatedDeliveryTime',
        'order.deliveryAddress',
        'order.deliveryName',
        'order.deliveryLatitude',
        'order.deliveryLongitude',
        'order.status',
        'order.totalAmount',
      ])
      .orderBy('orderGroupItem.isConfirmByDriver', 'DESC')
      .addOrderBy('order.createdAt', 'ASC');

    const queryIncomeOfDriver = this.orderGroupItemRepository
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

    if (typeof isConfirmByDriver === 'boolean') {
      queryBuilder.andWhere('orderGroupItem.isConfirmByDriver = :isConfirmByDriver', { isConfirmByDriver });
      queryIncomeOfDriver.andWhere('orderGroupItem.isConfirmByDriver = :isConfirmByDriver', { isConfirmByDriver });
    }

    const storeQuery = queryBuilder
      .clone()
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
      .leftJoinAndMapOne(
        'order.orderSystemAssignToDriver',
        'order.activities',
        'orderSystemAssignToDriver',
        `orderSystemAssignToDriver.orderId = order.id 
        AND orderSystemAssignToDriver.status = :statusSystemAssignToDriver 
        AND orderSystemAssignToDriver.performedBy = :performedBy`,
        { statusSystemAssignToDriver: EOrderStatus.OfferSentToDriver, performedBy: `driverId:${driverId}` },
      )
      .addSelect([
        'store.id',
        'store.name',
        'store.address',
        'store.streetName',
        'store.latitude',
        'store.longitude',
        'store.phoneNumber',
      ]);

    const clientQuery = queryBuilder
      .clone()
      .leftJoinAndMapOne(
        'order.orderDelivered',
        'order.activities',
        'orderDelivered',
        'orderDelivered.orderId = order.id AND orderDelivered.status = :statusDelivered',
        { statusDelivered: EOrderStatus.Delivered },
      )
      .leftJoin('order.client', 'client')
      .addSelect(['client.id', 'client.name', 'client.phone']);

    const [stores, clients] = await Promise.all([storeQuery.getMany(), clientQuery.getMany()]);
    const [criteria, incomeOfDriver] = await Promise.all([
      this.orderCriteriaService.getTimeCountDownToDriverConfirm(),
      queryIncomeOfDriver.getRawOne(),
    ]);

    stores.forEach((orderGroupItem) => {
      orderGroupItem.sortOrder = orderGroupItem.routePriority.store;
      if (!orderGroupItem.isConfirmByDriver) {
        const order = orderGroupItem.order;
        if (order?.orderSystemAssignToDriver?.createdAt) {
          const createdAt = moment(order.orderSystemAssignToDriver.createdAt).unix();
          const remaining = Math.max(0, criteria - (moment().unix() - createdAt));
          orderGroupItem.order.remaining = remaining;
        }
      }
    });

    clients.forEach((client) => {
      client.sortOrder = client.routePriority.client;
    });
    const orderGroupItems = stores.concat(clients);

    orderGroupItems.sort((a, b) => {
      return a.sortOrder - b.sortOrder;
    });

    const orderLetterMap = new Map<number, string>();
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let letterIndex = 0;

    orderGroupItems.forEach((orderGroupItem) => {
      if (!orderLetterMap.has(orderGroupItem.order.id)) {
        orderLetterMap.set(orderGroupItem.order.id, alphabet[letterIndex % alphabet.length]);
        letterIndex++;
      }
      orderGroupItem.order.letter = orderLetterMap.get(orderGroupItem.order.id);
    });

    return {
      orderGroupItems: orderGroupItems.map((order) => {
        return {
          ...order,
          criteria,
        };
      }),
      incomeOfDriver: Number(incomeOfDriver?.totalIncome) || 0,
      criteria,
    };
  }

  async sortOrderGroupItem(driverId: number, data: UpdateOrderGroupItemDto) {
    const orderGroupItems = await this.orderGroupItemRepository.find({
      where: {
        orderGroup: {
          driverId: driverId,
          status: EOrderGroupStatus.InDelivery,
        },
      },
      select: {
        id: true,
        routePriority: { store: true, client: true },
      },
    });

    if (isEmpty(orderGroupItems)) throw new BadRequestException(EXCEPTIONS.NOT_FOUND);
    if (orderGroupItems.length * 2 !== data.orderItems.length)
      throw new BadRequestException(EXCEPTIONS.QUATITY_ORDER_NOT_MATCH);

    orderGroupItems.forEach((orderGroupItem) => {
      orderGroupItem.routePriority.store = data.orderItems.find(
        (item) => item.orderItemId === orderGroupItem.id && item.sortType === EUserType.Merchant,
      ).index;
      orderGroupItem.routePriority.client = data.orderItems.find(
        (item) => item.orderItemId === orderGroupItem.id && item.sortType === EUserType.Client,
      ).index;
    });

    return await this.orderGroupItemRepository.save(orderGroupItems);
  }

  async sortOrderGroupItemDefault(driverId: number) {
    const orderGroupItems = await this.orderGroupItemRepository.find({
      where: {
        orderGroup: {
          driverId: driverId,
          status: EOrderGroupStatus.InDelivery,
        },
      },
      select: {
        id: true,
        createdAt: true,
        routePriority: { store: true, client: true },
      },
      order: {
        createdAt: 'ASC',
      },
    });

    if (isEmpty(orderGroupItems)) return;

    const totalItems = orderGroupItems.length;
    orderGroupItems.forEach((orderGroupItem, index) => {
      orderGroupItem.routePriority.store = index;
      orderGroupItem.routePriority.client = index + totalItems;
    });

    return await this.orderGroupItemRepository.save(orderGroupItems);
  }
}
