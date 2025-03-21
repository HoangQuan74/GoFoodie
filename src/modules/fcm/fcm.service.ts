import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as firebase from 'firebase-admin';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';
import { MerchantEntity } from 'src/database/entities/merchant.entity';
import { OrderEntity } from 'src/database/entities/order.entity';
import logger from 'src/logger/winston-daily-rotate-file.logger';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class FcmService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,

    @InjectRepository(MerchantEntity)
    private merchantRepository: Repository<MerchantEntity>,
  ) {}

  async sendToDevice(
    deviceToken: string,
    title: string,
    body: string,
    data?: { [key: string]: string },
    imageUrl?: string,
  ) {
    const message: Message = {
      token: deviceToken,
      data: data,
    };

    if (title) message.notification = { title: title, body: body, imageUrl: imageUrl };

    try {
      await firebase.messaging().send(message);
    } catch (error) {
      console.log('error', error);
      logger.error(error);
    }
  }

  async verifyToken(deviceToken: string) {
    try {
      const response = await firebase.messaging().send(
        {
          token: deviceToken,
        },
        true,
      );

      return response;
    } catch (error) {
      return null;
    }
  }

  async notifyDriverNewOrder(orderId: number) {
    const order = await this.orderRepository.findOne({
      select: {
        id: true,
        driver: { id: true, deviceToken: true },
        store: { id: true, latitude: true, longitude: true },
      },
      where: { id: orderId },
      relations: ['driver', 'store'],
    });
    if (!order) return;

    const title = 'New order';
    const body = 'You have a new order';

    const deviceTokens = new Set<string>();

    order.driver?.deviceToken && deviceTokens.add(order.driver.deviceToken);

    deviceTokens.forEach((deviceToken) => {
      this.sendToDevice(deviceToken, title, body, { order: JSON.stringify(order) });
    });
  }

  async sendNotificationToStaffs(
    storeId: number,
    title: string,
    body: string,
    data?: { [key: string]: string },
    imageUrl?: string,
  ) {
    const staffs = await this.merchantRepository
      .createQueryBuilder('merchant')
      .leftJoin('merchant.stores', 'store')
      .select(['merchant.id', 'merchant.deviceToken'])
      .where(
        new Brackets((qb) => {
          qb.where('merchant.storeId = :storeId', { storeId });
          qb.orWhere('store.id = :storeId');
        }),
      )
      .andWhere('merchant.deviceToken IS NOT NULL')
      .getMany();

    staffs.forEach((staff) => {
      this.sendToDevice(staff.deviceToken, title, body, data, imageUrl);
    });
  }
}
