import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';

@Injectable()
export class FirebaseService {
  async verifyIdToken(idToken: string): Promise<firebase.auth.DecodedIdToken> {
    return firebase.auth().verifyIdToken(idToken);
  }
}
