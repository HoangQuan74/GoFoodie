import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { EXCEPTIONS } from 'src/common/constants';
import { IS_PUBLIC_KEY } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { DriversService } from '../drivers/drivers.service';
// import { EDriverStatus } from 'src/common/enums/driver.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly driversService: DriversService,
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
      const payload = (await this.jwtService.verifyAsync(token)) as JwtPayload;
      const { id, deviceToken } = payload;
      const driver = await this.driversService.findOne({ where: { id } });

      // if (!driver || driver.status !== EDriverStatus.Active) throw new UnauthorizedException();
      if (deviceToken !== driver.deviceToken) throw new UnauthorizedException(EXCEPTIONS.INVALID_DEVICE_TOKEN);

      driver.lastLogin = new Date();
      this.driversService.save(driver);

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers

      request['user'] = driver;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
