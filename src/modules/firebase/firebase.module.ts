import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import * as admin from 'firebase-admin';

const firebaseProvider = {
  provide: 'FIREBASE',
  useFactory: async () => {
    const firebaseConfig = {
      project_id: process.env.FIREBASE_PROJECT_ID || '',
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || '',
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
      client_email: process.env.FIREBASE_CLIENT_EMAIL || '',
    } as admin.ServiceAccount;

    return admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  },
};

@Module({
  controllers: [],

  providers: [FirebaseService, firebaseProvider],
})
export class FirebaseModule {}
