import * as admin from 'firebase-admin';
import { FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID } from 'src/common/constants';

export const firebaseProvider = {
  provide: 'FIREBASE',
  useFactory: () => {
    const defaultApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    return { defaultApp };
  },
};
