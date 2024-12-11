import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { firebaseProvider } from './firebase.provider';

@Module({
  controllers: [],
  providers: [FirebaseService, firebaseProvider],
  exports: [FirebaseService],
})
export class FirebaseModule {}
