import { Injectable, UnauthorizedException } from '@nestjs/common';
import { comparePassword, hashPassword } from 'src/utils/bcrypt';
import { JwtPayload } from 'src/common/interfaces';
import { JWT_SECRET } from 'src/common/constants';
import { JwtService } from '@nestjs/jwt';
import { AdminsService } from '../admins/admins.service';
import { AdminEntity } from 'src/database/entities/admin.entity';

@Injectable()
export class AuthService {
  constructor(
    private adminsService: AdminsService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string): Promise<Omit<AdminEntity, 'password'> & { accessToken: string }> {
    const admin = await this.adminsService.findOne({ where: { username } });
    if (!admin) throw new UnauthorizedException();

    const isPasswordMatching = comparePassword(password, admin.password);
    if (!isPasswordMatching) throw new UnauthorizedException();

    const payload: JwtPayload = { id: admin.id };
    const accessToken = this.jwtService.sign(payload, { secret: JWT_SECRET, expiresIn: '1d' });

    admin.lastLogin = new Date();
    this.adminsService.save(admin);

    delete admin.password;
    return { ...admin, accessToken };
  }
}
