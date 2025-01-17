import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';
import logger from 'src/logger/winston-daily-rotate-file.logger';

@Injectable()
export class FcmService {
  async sendToDevice(deviceToken: string, title: string, body: string, data?: { [key: string]: string }) {
    const message: Message = {
      notification: {
        title: title,
        body: body,
      },
      token: deviceToken,
      data: data,
    };

    try {
      await firebase.messaging().send(message);
    } catch (error) {
      logger.error(error);
    }
  }
}
