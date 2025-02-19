import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EXCEPTIONS } from 'src/common/constants';
import { EOrderGroupStatus } from 'src/common/enums';
import { OrderGroupItemEntity } from 'src/database/entities/order-group-item.entity';
import { OrderGroupEntity } from 'src/database/entities/order-group.entity';
import { OrderEntity } from 'src/database/entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderGroupService {
    constructor(
        // @InjectRepository(OrderGroupEntity)
        // private orderGroupRepository: Repository<OrderGroupEntity>,

        // @InjectRepository(OrderGroupItemEntity)
        // private orderGroupItemRepository: Repository<OrderGroupItemEntity>,

        // @InjectRepository(OrderEntity)
        // private orderRepository: Repository<OrderEntity>,
    ) { }

    async getCurrentOrderGroup(driverId: number) {
        // const queryBuilder = this.orderGroupItemRepository.createQueryBuilder('orderGroupItem')
        //     .innerJoin('orderGroupItem.orderGroup', 'orderGroup')
        //     .innerJoin('orderGroupItem.order', 'order')
        //     .leftJoin('order.client', 'client')
        //     .leftJoin('order.store', 'store')
        //     .where('orderGroup.driverId = :driverId', { driverId })
        //     .andWhere('orderGroup.status = :status', { status: EOrderGroupStatus.InDelivery })
        //     .select([
        //         'orderGroupItem.id',
        //         'order.id',
        //         'order.orderCode',
        //         'order.estimatedOrderTime',
        //         'order.estimatedPickupTime',
        //         'order.deliveryAddress',
        //         'order.deliveryLatitude',
        //         'order.deliveryLongitude',
        //         'client.id',
        //         'client.name',
        //         'store.id',
        //         'store.name',
        //         'store.address',
        //         'store.streetName',
        //         'store.latitude',
        //         'store.longitude',
        //     ]);

        // const result = await queryBuilder
        //     .orderBy('order.createdAt', 'DESC')
        //     .getMany();

        // return result;
    }

    // async upsertOrderGroup(orderId: number, driverId: number) {
    //     const order = await this.orderRepository.findOneBy({ id: orderId });
    //     if (!order) {
    //         throw new BadRequestException(EXCEPTIONS.NOT_FOUND);
    //     }

    //     let orderGroup = await this.orderGroupRepository.findOne({
    //         where: {
    //             driverId: driverId,
    //             status: EOrderGroupStatus.InDelivery,
    //         }
    //     });

    //     if (!orderGroup) {
    //         orderGroup = await this.orderGroupRepository.save({
    //             driverId: driverId,
    //             status: EOrderGroupStatus.InDelivery,
    //         });
    //     }

    //     return await this.orderGroupItemRepository.save({
    //         orderGroup: orderGroup,
    //         order: order,
    //     });
    // }
}
