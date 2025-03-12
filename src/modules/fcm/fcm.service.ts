import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as firebase from 'firebase-admin';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';
import { OrderEntity } from 'src/database/entities/order.entity';
import logger from 'src/logger/winston-daily-rotate-file.logger';
import { Repository } from 'typeorm';

@Injectable()
export class FcmService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
  ) {}

  async sendToDevice(deviceToken: string, title: string, body: string, data?: { [key: string]: string }) {
    const message: Message = {
      token: deviceToken,
      data: data,
    };

    if (title) message.notification = { title: title, body: body };

    try {
      console.log('message', message);

      await firebase.messaging().send(message);
    } catch (error) {
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

  async notifyMerchantNewOrder(orderId: number) {
    const order = await this.orderRepository.findOne({
      select: {
        id: true,
        store: { id: true, merchant: { id: true, deviceToken: true }, staffs: { id: true, deviceToken: true } },
      },
      where: { id: orderId },
      relations: ['store', 'store.merchant', 'store.staffs'],
    });
    if (!order) return;

    const title = 'New order';
    const body = 'You have a new order';

    const deviceTokens = new Set<string>();

    order.store.merchant?.deviceToken && deviceTokens.add(order.store.merchant.deviceToken);
    order.store.staffs?.forEach((staff) => {
      staff.deviceToken && deviceTokens.add(staff.deviceToken);
    });

    deviceTokens.forEach((deviceToken) => {
      this.sendToDevice(deviceToken, title, body, { orderId: orderId.toString() });
    });
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
}
