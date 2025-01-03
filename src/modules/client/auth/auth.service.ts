import { Injectable } from '@nestjs/common';
import { JwtSign } from 'src/common/interfaces';
import { ClientEntity } from 'src/database/entities/client.entity';

@Injectable()
export class AuthService {
  constructor() {}
}
