import * as admin from 'firebase-admin';

export const firebaseProvider = {
  provide: 'FIREBASE',
  useFactory: () => {
    return admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  },
};
