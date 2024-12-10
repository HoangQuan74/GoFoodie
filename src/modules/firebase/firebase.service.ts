import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private readonly firebaseApp: admin.app.App;

  constructor() {
    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }

  async sendNotification(token: string, title: string, body: string) {
    const message: admin.messaging.Message = {
      notification: {
        title,
        body,
      },
      token,
    };

    return this.firebaseApp.messaging().send(message);
  }
}
