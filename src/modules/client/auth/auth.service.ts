import { Injectable } from '@nestjs/common';
import { LoginSmsDto } from './dto/login.dto';
import { FirebaseService } from 'src/modules/firebase/firebase.service';
import { ClientService } from '../clients/client.service';
import { ClientEntity } from 'src/database/entities/client.entity';
import { JwtPayload } from 'src/common/interfaces';
import { JwtService } from '@nestjs/jwt';
import { JWT_EXPIRATION } from 'src/common/constants';
import { ERoleType } from 'src/common/enums';

@Injectable()
export class AuthService {
  constructor(
    private firebaseService: FirebaseService,
    private readonly jwtService: JwtService,
    private readonly clientService: ClientService,
  ) {}

  async signInWithSms(body: LoginSmsDto) {
    const { idToken, ...rest } = body;

    const { phone_number } = await this.firebaseService.verifyIdToken(idToken);
    const phone = phone_number.replace('+84', '0');

    let client = await this.clientService.findOne({ where: { phone } });

    if (!client) {
      client = new ClientEntity();
      client.phone = phone;
      Object.assign(client, rest);

      client = await this.clientService.save(client);
    }

    const payload: JwtPayload = { id: client.id, deviceToken: rest.deviceToken, type: ERoleType.Client };
    const accessToken = this.jwtService.sign(payload, { expiresIn: JWT_EXPIRATION });
    const refreshToken = '';

    client.lastLogin = new Date();
    client.deviceToken = rest.deviceToken;
    await this.clientService.save(client);

    return { ...client, accessToken, refreshToken };
  }
}
