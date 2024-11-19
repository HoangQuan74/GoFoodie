import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { comparePassword, hashPassword } from 'src/utils/bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UserEntity } from 'src/database/entities/user.entity';
import { JwtPayload } from 'src/common/interfaces';
import { JWT_SECRET } from 'src/common/constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string): Promise<Omit<UserEntity, 'password'> & { accessToken: string }> {
    const user = await this.usersService.findOne({ where: { username } });
    if (!user) throw new UnauthorizedException();

    const isPasswordMatching = comparePassword(password, user.password);
    if (!isPasswordMatching) throw new UnauthorizedException();

    // TODO: Generate a JWT and return it here
    // instead of the user object
    const payload: JwtPayload = { id: user.id };
    const accessToken = this.jwtService.sign(payload, { secret: JWT_SECRET, expiresIn: '1d' });

    delete user.password;
    return { ...user, accessToken };
  }

  async signUp(data: RegisterDto): Promise<Omit<UserEntity, 'password'>> {
    data.password = hashPassword(data.password);
    const user = await this.usersService.create(data);
    delete user.password;
    return user;
  }
}
