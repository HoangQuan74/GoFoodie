import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { EXCEPTIONS, JWT_SECRET } from 'src/common/constants';
import { IS_PUBLIC_KEY } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { MerchantsService } from '../merchants/merchants.service';
import { EMerchantStatus } from 'src/common/enums';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly merchantService: MerchantsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedException();

    try {
      const payload = (await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET,
      })) as JwtPayload;

      const { id, deviceToken } = payload;
      const merchant = await this.merchantService.findOne({ where: { id } });
      if (!merchant || merchant.status !== EMerchantStatus.Active) throw new UnauthorizedException();
      if (deviceToken !== merchant.deviceToken) throw new UnauthorizedException(EXCEPTIONS.INVALID_DEVICE_TOKEN);

      merchant.lastLogin = new Date();
      this.merchantService.save(merchant);

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers

      request['user'] = merchant;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
